import { IsBoolean, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class UpdateEstacioneDto {

    @IsOptional()
    @IsString()
    @MinLength(1)
    readonly nombre: string;
    
    @IsOptional()
    @IsString()
    @MinLength(1)
    readonly ubicacion: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @IsUUID()
    readonly userAdminId: string;

    @IsOptional()
    @IsBoolean()
    readonly estado: boolean;
}