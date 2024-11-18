import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { Bus } from './entities/bus.entity';
import { v4 as uuid } from 'uuid';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { ActivitiesService } from 'src/activities/activities.service';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class BusesService {

  constructor(
    private readonly dynamoService: DynamodbService,
    private readonly usersService: UsersService,
    private readonly activitiesService: ActivitiesService
  ){}

  //CREAR
  async create(createBusDto: CreateBusDto, request: Request){
    const {userAdminId} = createBusDto;

    //verificar si es un administrador
    await this.usersService.findOneByIdAdmin(userAdminId);

    //crear el nuevo objeto
    const newBus: Bus = {
      primaryKey: uuid(),
      ...createBusDto,
      createdAt: new Date().getTime(),
      updatedAt: null,
      estado: true,
    }

    //preparar la consulta
    const command = new PutCommand({
      TableName: 'buses',
      Item: {
        ...newBus
      }
    })
    await this.dynamoService.dynamoCliente.send(command);

    // Obtiene la IP del usuario de forma segura
    const userIp = this.extractUserIp(request);
                
    // Registra la actividad
    await this.activitiesService.create({
      userId: createBusDto.userAdminId,
      activityType: 'REGISTRO DE BUS',
      detail: `Bus con placa ${createBusDto.placa} registrado.`,
       ip: userIp
    });

    return newBus;
  }

  //OBTENER TODOS
  async findAll() {
    const command = new ScanCommand({
      TableName: 'buses',
    });
    const { Items } = await this.dynamoService.dynamoCliente.send(command);

    return Items.map(item => unmarshall(item));
  }

  //OBTENER POR ID
  async findOne(id: string) {
    const command = new GetCommand({
      TableName: 'buses',
      Key: {
        primaryKey: id,
      },
    });
    const {Item} = await this.dynamoService.dynamoCliente.send(command);
    if(!Item)
      throw new NotFoundException('Bus no encontrado.')
    return Item;
  }

  //ACTULIZAR
  async update(id: string, updateBusDto: UpdateBusDto, request: Request) {
    const {userAdminId,capacidad,modelo,placa,estado} = updateBusDto;
    if(!capacidad && !modelo && !placa)
      throw new NotFoundException('No hay datos para actilizar.')
    
    //verificar si es un admintrador
    await this.usersService.findOneByIdAdmin(userAdminId);

    //verificar si existe ese bus
    const busBD = await this.findOne(id);

    //actualizacion de campos
    busBD.updatedAt = new Date().getTime();
    if(capacidad) busBD.capacidad = capacidad;
    if(modelo) busBD.modelo = modelo;
    if(placa) busBD.placa = placa;
    if(estado !== undefined) busBD.estado = estado;

    //preparacion de la consulta
    const comand = new  PutCommand({
      TableName: 'buses',
      Item: {
        ...busBD
      }
    });         
    await this.dynamoService.dynamoCliente.send(comand)

    // Obtiene la IP del usuario de forma segura
    const userIp = this.extractUserIp(request);
                
    // Registra la actividad
    await this.activitiesService.create({
      userId: updateBusDto.userAdminId,
      activityType: 'ACTUALIZACIÓN DE BUS',
      detail: `Bus con placa ${busBD.placa} actualizado.`,
      ip: userIp,
    });
    
    
    //retornar el bus actualizado
    return busBD
  }

  // Función para extraer la IP del usuario
  private extractUserIp(request: Request): string {
    let userIp = Array.isArray(request.headers['x-forwarded-for'])
      ? request.headers['x-forwarded-for'][0]
      : (request.headers['x-forwarded-for'] as string) || request.ip;
    return userIp === '::1' ? '127.0.0.1' : userIp;
  }
  
}
