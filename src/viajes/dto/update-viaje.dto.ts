import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class UpdateViajeDto {

  @IsOptional()
  @IsString()
  @MinLength(1)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  costo?: number;

  @IsOptional()
  @IsString()
  @IsUUID()
  idBus?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  idEstacionOrigen?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  idEstacionDestino?: string;

  @IsOptional()
  @IsInt()
  fechaHoraSalida?: number;

  @IsOptional()
  @IsInt()
  fechaHoraLlegada?: number;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @IsOptional()
  @IsBoolean()
  statusPromo?: boolean;

  @IsOptional()
  @IsInt()
  descuentoPorcentaje?: number;

  @IsString()
  @IsUUID()
  userAdminId: string; // Relación con el administrador
}
