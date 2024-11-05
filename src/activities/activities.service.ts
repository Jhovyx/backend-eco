import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity } from './entities/activity.entity';
import { v4 as uuid } from 'uuid';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { ScanCommand } from '@aws-sdk/client-dynamodb';

@Injectable()
export class ActivitiesService {
//create, findAll and findOne
  constructor(
    private readonly dynamodbService: DynamodbService
  ){}

  async create(createActivityDto: CreateActivityDto) {
    const newActicity: Activity = {
      primaryKey: uuid(),
      createdAt: new Date().getTime(),
      ...createActivityDto
    };
    const command = new PutCommand({
      TableName: 'activities',
      Item: {
        ...newActicity
      }
    })
    await this.dynamodbService.dynamoCliente.send(command)
    return 'Actividad creada exitosamente.';
  }

  async findAll() {
    const command = new ScanCommand({
      TableName: 'activities',
    });
    const result = await this.dynamodbService.dynamoCliente.send(command);
    return result.Items.map(item => this.formatActivity(item));
  }

  async findOne(id: string) {
    const command = new GetCommand({
      TableName: 'activities',
      Key: {
        primaryKey: id,
      },
    });    
    const result = await this.dynamodbService.dynamoCliente.send(command);
    if(!result.Item)
      throw new NotFoundException('Actividad no encontrada.')
    return result.Item
  }

  private formatActivity(item: any) {
    return {
      primaryKey: item.primaryKey.S,
      userId: item.userId.S,
      action: item.action.S,
      createdAt: item.createdAt.N,
      detail: item.detail.S,
    };
  }

}
