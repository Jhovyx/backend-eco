import { Injectable } from '@nestjs/common';
import { CreateAsientoDto } from './dto/create-asiento.dto';
import { UpdateAsientoDto } from './dto/update-asiento.dto';

@Injectable()
export class AsientosService {
  create(createAsientoDto: CreateAsientoDto) {
    return 'This action adds a new asiento';
  }

  findAll() {
    return `This action returns all asientos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asiento`;
  }

  update(id: number, updateAsientoDto: UpdateAsientoDto) {
    return `This action updates a #${id} asiento`;
  }

  remove(id: number) {
    return `This action removes a #${id} asiento`;
  }
}
