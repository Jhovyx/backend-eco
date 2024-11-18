import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstacioneDto } from './dto/create-estacione.dto';
import { UpdateEstacioneDto } from './dto/update-estacione.dto';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { UsersService } from 'src/users/users.service';
import { ActivitiesService } from 'src/activities/activities.service';
import { Estacion } from './entities/estacione.entity';
import { PutCommand, ScanCommand, GetCommand} from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';
import { Request } from 'express';
import { unmarshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class EstacionesService {

  constructor(
    private readonly dynamoService: DynamodbService,
    private readonly usersService: UsersService,
    private readonly activitiesService: ActivitiesService
  ){}

  //CREAR
  async create(createEstacioneDto: CreateEstacioneDto, request: Request) {

    //verificamos si el usuario es admin
    await this.usersService.findOneByIdAdmin(createEstacioneDto.userAdminId);

    //creacion de la nueva estacion
    const newEstacion: Estacion = {
      primaryKey: uuid(),
      ubicacion: createEstacioneDto.ubicacion,
      nombre: createEstacioneDto.nombre.toUpperCase(),
      createdAt: new Date().getTime(),
      updatedAt: null,
      estado: true,
      userAdminId: createEstacioneDto.userAdminId
    }

    //preparacion de la consulta
    const command = new PutCommand({
      TableName: 'estaciones',
      Item: {
        ...newEstacion
      }
    })
    await this.dynamoService.dynamoCliente.send(command);

    // Obtiene la IP del usuario de forma segura
    const userIp = this.extractUserIp(request);
                
    // Registra la actividad
    await this.activitiesService.create({
      userId: createEstacioneDto.userAdminId,
      activityType: 'REGISTRO DE ESTACIÓN',
      detail: `Estacion con nombre ${createEstacioneDto.nombre} registrada.`,
      ip: userIp
    });

    //devuelve la estacion creada
    return newEstacion;
  }

  //OBTENER TODAS
  async findAll() {
    const command = new ScanCommand({
      TableName: 'estaciones',
    });
    const { Items } = await this.dynamoService.dynamoCliente.send(command);

    return Items;
  }

  //OBTENER POR ID
  async findOne(id: string) {
    const command = new GetCommand({
      TableName: 'estaciones',
      Key: {
        primaryKey: id,
      },
    });
    const {Item} = await this.dynamoService.dynamoCliente.send(command);
    if(!Item)
      throw new NotFoundException('Estacion no encontrado.')
    return Item;
  }

  //ACTUALIZAR
  async update(id: string, updateEstacioneDto: UpdateEstacioneDto, request: Request) {
    const {nombre,userAdminId,ubicacion,estado} = updateEstacioneDto;

    //verificar si es un administrador
    await this.usersService.findOneByIdAdmin(userAdminId);
    
    //buscar la estacion
    const estacionBD = await this.findOne(id);
    
    //actulizacion de campos
    if(nombre && nombre.length !== 0) estacionBD.nombre = nombre.toUpperCase();
    if(ubicacion && ubicacion.length !== 0) estacionBD.ubicacion = ubicacion;
    if(estado !== undefined) estacionBD.estado = estado;
    estacionBD.updatedAt = new Date().getTime();

    //preparacion de la consulta
    const comand = new  PutCommand({
      TableName: 'estaciones',
      Item: {
        ...estacionBD
      }
    });
    await this.dynamoService.dynamoCliente.send(comand)

    // Obtiene la IP del usuario de forma segura
    const userIp = this.extractUserIp(request);
                
    // Registra la actividad
    await this.activitiesService.create({
      userId: updateEstacioneDto.userAdminId,
      activityType: 'ACTUALIZACIÓN DE ESTACIÓN',
      detail: `Estación con nombre ${updateEstacioneDto.nombre} actualizado.`,
      ip: userIp,
    });

    return estacionBD;
  }

  // Función para extraer la IP del usuario
  private extractUserIp(request: Request): string {
    let userIp = Array.isArray(request.headers['x-forwarded-for'])
      ? request.headers['x-forwarded-for'][0]
      : (request.headers['x-forwarded-for'] as string) || request.ip;
    return userIp === '::1' ? '127.0.0.1' : userIp;
  }
}
