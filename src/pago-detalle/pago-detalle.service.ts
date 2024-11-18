import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePagoDetalleDto } from './dto/create-pago-detalle.dto';
import { UpdatePagoDetalleDto } from './dto/update-pago-detalle.dto';
import { PagoDetalleModule } from './pago-detalle.module'; // Importa el modelo

@Injectable()
export class PagoDetalleService {
  private pagoDetalles: PagoDetalleModule[] = []; // Usa el modelo para tipar los datos
  private idCounter = 1;

  create(createPagoDetalleDto: CreatePagoDetalleDto): PagoDetalleModule {
    const nuevoPago: PagoDetalleModule = {
      id: this.idCounter++,
      ...createPagoDetalleDto,
    };
    this.pagoDetalles.push(nuevoPago);
    return nuevoPago;
  }

  findAll(): PagoDetalleModule[] {
    return this.pagoDetalles;
  }

  findOne(id: number): PagoDetalleModule {
    const pagoDetalle = this.pagoDetalles.find((p) => p.id === id);
    if (!pagoDetalle) {
      throw new NotFoundException(`PagoDetalle con ID ${id} no encontrado.`);
    }
    return pagoDetalle;
  }

  update(id: number, updatePagoDetalleDto: UpdatePagoDetalleDto): PagoDetalleModule {
    const index = this.pagoDetalles.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`PagoDetalle con ID ${id} no encontrado.`);
    }

    this.pagoDetalles[index] = { ...this.pagoDetalles[index], ...updatePagoDetalleDto };
    return this.pagoDetalles[index];
  }

  remove(id: number): { message: string } {
    const index = this.pagoDetalles.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`PagoDetalle con ID ${id} no encontrado.`);
    }

    this.pagoDetalles.splice(index, 1);
    return { message: `PagoDetalle con ID ${id} eliminado.` };
  }
}

