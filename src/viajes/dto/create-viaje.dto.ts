import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateViajeDto {

  @IsString()
  @MinLength(1)
  urlImagen: string;

  @IsString()
  @MinLength(1)
  nombre: string;

  @IsString()
  @MinLength(1)
  descripcion: string;

  @IsOptional()
  @IsNumber()
  costo?: number;

  @IsString()
  @IsUUID()
  userAdminId: string; // Relación con el administrador

  @IsString()
  @IsUUID()
  idBus: string;  // Relación con el bus

  @IsString()
  @IsUUID()
  idEstacionOrigen: string; // Relación con la estación de origen

  @IsString()
  @IsUUID()
  idEstacionDestino: string; // Relación con la estación de destino

  @IsInt()
  fechaHoraSalida: number;

  @IsInt()
  fechaHoraLlegada: number;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @IsOptional()
  @IsBoolean()
  statusPromo?: boolean;

  @IsOptional()
  @IsInt()
  descuentoPorcentaje?: number;

}
