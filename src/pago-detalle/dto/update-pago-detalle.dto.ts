
import { PartialType } from '@nestjs/mapped-types';
import { CreatePagoDetalleDto } from './create-pago-detalle.dto';

export class UpdatePagoDetalleDto extends PartialType(CreatePagoDetalleDto) {}
