import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoletaDto } from './dto/create-boleta.dto';
import { Boleta } from './entities/boleta.entity';


@Injectable()
export class BoletaService {
 
  private boletas: Boleta[] = [];

  // Crear
  async create(createBoletaDto: CreateBoletaDto): Promise<Boleta> {
    const newBoleta = {
      id: this.boletas.length + 1,
      ...createBoletaDto,
    };
    this.boletas.push(newBoleta);
    return newBoleta;
  }

  // Listar todos
  async findAll(): Promise<Boleta[]> {
    return this.boletas;
  }

  // Listar por ID
  async findOne(id: number): Promise<Boleta> {
    const boleta = this.boletas.find(boleta => boleta.id === id);
    if (!boleta) {
      throw new NotFoundException('Boleta no encontrada.');
    }
    return boleta;
  }

  // Actualizar
  async update(id: number, updateBoletaDto: CreateBoletaDto): Promise<{ message: string, boleta: Boleta }> {
    const boletaIndex = this.boletas.findIndex(boleta => boleta.id === id);
    if (boletaIndex > -1) {
      this.boletas[boletaIndex] = { id, ...updateBoletaDto };
      return { message: `Boleta ${id} actualizada exitosamente.`, boleta: this.boletas[boletaIndex] };
    }
    throw new NotFoundException(`Boleta ${id} no encontrada.`);
  }

  // Eliminar
  async remove(id: number): Promise<{ message: string }> {
    const boletaIndex = this.boletas.findIndex(boleta => boleta.id === id);
    if (boletaIndex > -1) {
      this.boletas.splice(boletaIndex, 1);
      return { message: `Boleta ${id} eliminada exitosamente.` };
    }
    throw new NotFoundException(`Boleta ${id} no encontrada.`);
  }
}
