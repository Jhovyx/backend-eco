import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity } from './entities/activity.entity';
import { v4 as uuid } from 'uuid';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class ActivitiesService {
//create, findAll and findOne
  constructor(
    private readonly dynamodbService: DynamodbService
  ){}

  //CREAR
  async create(createActivityDto: CreateActivityDto) {

    //crear la nueva actividad
    const newActicity: Activity = {
      primaryKey: uuid(),
      createdAt: new Date().getTime(),
      ...createActivityDto
    };

    //preparacion de la consulta
    const command = new PutCommand({
      TableName: 'activities',
      Item: {
        ...newActicity
      }
    })
    await this.dynamodbService.dynamoCliente.send(command)
    return 'Actividad creada exitosamente.';
  }

  //OBTENER TODAS 
  async findAll() {
    const command = new ScanCommand({
      TableName: 'activities',
    });
    const {Items} = await this.dynamodbService.dynamoCliente.send(command);

    return Items.map(item => unmarshall(item));
  }

  //OBTENER PO ID
  async findOne(id: string) {
    const command = new GetCommand({
      TableName: 'activities',
      Key: {
        primaryKey: id,
      },
    });
    const {Item} = await this.dynamodbService.dynamoCliente.send(command);
    if(!Item)
      throw new NotFoundException('Actividad no encontrada.')
    return Item
  }
}
