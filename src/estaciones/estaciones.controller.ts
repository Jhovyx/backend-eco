import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseUUIDPipe } from '@nestjs/common';
import { EstacionesService } from './estaciones.service';
import { CreateEstacioneDto } from './dto/create-estacione.dto';
import { UpdateEstacioneDto } from './dto/update-estacione.dto';
import { Request } from 'express';

@Controller('estaciones')
export class EstacionesController {
  constructor(private readonly estacionesService: EstacionesService) {}

  @Post()
  create(@Body() createEstacioneDto: CreateEstacioneDto, @Req() request: Request) {
    return this.estacionesService.create(createEstacioneDto,request);
  }

  @Get()
  findAll() {
    return this.estacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.estacionesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEstacioneDto: UpdateEstacioneDto, @Req() request: Request) {
    return this.estacionesService.update(id, updateEstacioneDto,request);
  }

}
