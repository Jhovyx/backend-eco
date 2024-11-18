
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PagoDetalleService } from './pago-detalle.service';
import { CreatePagoDetalleDto } from './dto/create-pago-detalle.dto';
import { UpdatePagoDetalleDto } from './dto/update-pago-detalle.dto';

@Controller('pago-detalle')
export class PagoDetalleController {
  constructor(private readonly pagoDetalleService: PagoDetalleService) {}

  @Post()
  create(@Body() createPagoDetalleDto: CreatePagoDetalleDto) {
    return this.pagoDetalleService.create(createPagoDetalleDto);
  }

  @Get()
  findAll() {
    return this.pagoDetalleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pagoDetalleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePagoDetalleDto: UpdatePagoDetalleDto) {
    return this.pagoDetalleService.update(id, updatePagoDetalleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.pagoDetalleService.remove(id);
  }
}
