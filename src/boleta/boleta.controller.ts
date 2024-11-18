import { Controller, Get, Post, Body, Patch, Param, Delete, Put, NotFoundException } from '@nestjs/common';
import { BoletaService } from './boleta.service';
import { CreateBoletaDto } from './dto/create-boleta.dto';


@Controller('boleta')
export class BoletaController {
  constructor(private readonly boletaService: BoletaService) {}

  @Post()
  async create(@Body() createBoletaDto: CreateBoletaDto) {
    return await this.boletaService.create(createBoletaDto);
  }

  @Get()
  async findAll() {
    return await this.boletaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const boleta = await this.boletaService.findOne(id);
    if (!boleta) {
      throw new NotFoundException('Boleta no encontrada.');
    }
    return boleta;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBoletaDto: CreateBoletaDto) {
    return await this.boletaService.update(id, updateBoletaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.boletaService.remove(id);
  }
}



