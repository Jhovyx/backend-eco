import { Module } from '@nestjs/common';
import { BoletaService } from './boleta.service';
import { BoletaController } from './boleta.controller';

@Module({
  controllers: [BoletaController],
  providers: [BoletaService],
})
export class BoletaModule {}
