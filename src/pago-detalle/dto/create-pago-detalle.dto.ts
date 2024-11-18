
import { IsString, IsNotEmpty, IsDateString, Length } from 'class-validator';

export class CreatePagoDetalleDto {
  @IsString()
  @IsNotEmpty()
  @Length(16, 16, { message: 'El número de tarjeta debe tener exactamente 16 dígitos.' })
  numeroTarjeta: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50, { message: 'El nombre de la tarjeta debe tener entre 3 y 50 caracteres.' })
  nombreTarjeta: string;

  @IsDateString({}, { message: 'La fecha de vencimiento debe ser una fecha válida (formato YYYY-MM-DD).' })
  fechaVencimiento: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 4, { message: 'El código de seguridad debe tener entre 3 y 4 dígitos.' })
  codigoSeguridad: string;
}
