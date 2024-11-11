import { IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdateBusDto {

    @IsOptional()
    @IsString()
    @MinLength(1)
    readonly placa: string;
    
    @IsOptional()
    @IsNumber()
    @Min(1)
    readonly capacidad: number;

    @IsOptional()
    @IsString()
    @MinLength(1)
    readonly modelo: string;


}
