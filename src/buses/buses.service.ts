import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { Bus } from './entities/bus.entity';
import { v4 as uuid } from 'uuid';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { ActivitiesService } from 'src/activities/activities.service';
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { GetItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';

@Injectable()
export class BusesService {

  constructor(
    private readonly dynamoService: DynamodbService,
    private readonly usersService: UsersService,
    private readonly activitiesService: ActivitiesService
  ){}

  async create(createBusDto: CreateBusDto, request: Request){
    const {userAdminId,...bus} = createBusDto;
    await this.usersService.findOneByIdAdmin(userAdminId);
    const newBus: Bus = {
      primaryKey: uuid(),
      ...bus,
      createdAt: new Date().getTime(),
      updatedAt: null,
      estado: true,
    }
    const command = new PutCommand({
      TableName: 'buses',
      Item: {
        ...newBus
      }
    })

    await this.dynamoService.dynamoCliente.send(command);

    let userIp = Array.isArray(request.headers['x-forwarded-for']) 
    ? request.headers['x-forwarded-for'][0]  // Si es un arreglo, toma la primera IP
    : (request.headers['x-forwarded-for'] as string) || request.ip; // Si no, usa la IP del encabezado o la IP directa
    if (userIp === '::1') userIp = '127.0.0.1'; 

    await this.activitiesService.create({
      userId: createBusDto.userAdminId,
      activityType: 'REGISTRO DE BUS',
      detail: `Bus con placa ${createBusDto.placa} registrado.`,
       ip: userIp
    });

    return this.formatBus(newBus);

  }

  async findAll() {
    const command = new ScanCommand({
      TableName: 'buses',
    });

    const { Items } = await this.dynamoService.dynamoCliente.send(command);
    return Items.map(item => this.formatBus(item));
  }

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

  async update(id: string, updateBusDto: UpdateBusDto, request: Request) {
    const {userAdminId,capacidad,modelo,placa,estado} = updateBusDto;
    if(!capacidad && !modelo && !placa)
      throw new NotFoundException('No hay datos para actilizar.')
    await this.usersService.findOneByIdAdmin(userAdminId);
    const busBD = await this.findOne(id);
    busBD.updatedAt = new Date().getTime();
    if(capacidad) busBD.capacidad = capacidad;
    if(modelo) busBD.modelo = modelo;
    if(placa) busBD.placa = placa;
    if(estado) busBD.estado = estado;
    const comand = new  PutCommand({
      TableName: 'buses',
      Item: {
        ...busBD
      }
    });

    await this.dynamoService.dynamoCliente.send(comand)

    let userIp = Array.isArray(request.headers['x-forwarded-for']) 
    ? request.headers['x-forwarded-for'][0]  // Si es un arreglo, toma la primera IP
    : (request.headers['x-forwarded-for'] as string) || request.ip; // Si no, usa la IP del encabezado o la IP directa
    if (userIp === '::1') userIp = '127.0.0.1'; 
    // Registrar la actividad después de actualizar el bus
    await this.activitiesService.create({
      userId: updateBusDto.userAdminId,
      activityType: 'ACTUALIZACIÓN DE BUS',
      detail: `Bus con placa ${busBD.placa} actualizado.`,
      ip: userIp,
    });
    return busBD
  }

  async remove(id: string, updateBusDto: UpdateBusDto, request: Request) {
    const {userAdminId} = updateBusDto;
    await this.usersService.findOneByIdAdmin(userAdminId);
    await this.findOne(id);
    const updateCommand = new UpdateCommand({
      TableName: 'buses', 
      Key: { primaryKey: id },
      UpdateExpression: 'SET estado = :estado, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':estado': false,
        ':updatedAt': new Date().getTime(),
      },
    });
    // Ejecutamos el comando de actualización
    await this.dynamoService.dynamoCliente.send(updateCommand);
    let userIp = Array.isArray(request.headers['x-forwarded-for']) 
    ? request.headers['x-forwarded-for'][0]  // Si es un arreglo, toma la primera IP
    : (request.headers['x-forwarded-for'] as string) || request.ip; // Si no, usa la IP del encabezado o la IP directa
    if (userIp === '::1') userIp = '127.0.0.1';   
    // Registrar la actividad después de eliminar el bus
    await this.activitiesService.create({
      userId: updateBusDto.userAdminId,
      activityType: 'ELIMINACIÓN DE BUS',
      detail: `Bus con ID ${id} eliminado.`,
      ip: userIp,
    });

    // Retornar mensaje de eliminación
    return `El bus con ID ${id} ha sido eliminado correctamente.`;
  }

  private formatBus(item: any) {
    return {
      primaryKey: item.primaryKey.S,
      placa: item.placa.S,
      modelo: item.modelo.S,
      capacidad: Number(item.capacidad.N),
      estado: item.estado.BOOL,
      createdAt: Number(item.createdAt.N),
      updatedAt: item.updatedAt.NULL ? null : Number(item.updatedAt.N),
    };
  }
  
}
