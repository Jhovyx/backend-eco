import { IsString, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateBoletaDto {
   
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fechaEmision: Date;

  @IsNotEmpty()
  @IsString()
  pasajero: string;

  @IsNotEmpty()
  @IsString()
  cajero: string;

  @IsNotEmpty()
  @IsString()
  detalleServicio: string;

  @IsNotEmpty()
  @IsString()
  origen: string;

  @IsNotEmpty()
  @IsString()
  destino: string;

  @IsNotEmpty()
  @IsString()
  servicio: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fechaViaje: Date;

  @IsNotEmpty()
  @IsString()
  horaSalida: string;

  @IsNotEmpty()
  @IsString()
  asiento: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  embarque: string;

  @IsNotEmpty()
  @IsString()
  desembarque: string;
}
