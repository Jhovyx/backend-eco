import { Module } from '@nestjs/common';
import { AsientosService } from './asientos.service';
import { AsientosController } from './asientos.controller';

@Module({
  controllers: [AsientosController],
  providers: [AsientosService],
})
export class AsientosModule {}
