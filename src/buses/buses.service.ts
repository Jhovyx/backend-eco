import { Injectable } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { Bus } from './entities/bus.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BusesService {
  create(createBusDto: CreateBusDto) {
    
    /*const newBus: Bus = {
      primaryKey: uuid(),
      ...CreateBusDto,
      createdAt: new Date().getTime(),
      updatedAt: null,
      estado: true,
    }*/

  }

  findAll() {
    return `This action returns all buses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bus`;
  }

  update(id: number, updateBusDto: UpdateBusDto) {
    return `This action updates a #${id} bus`;
  }

  remove(id: number) {
    return `This action removes a #${id} bus`;
  }
}
