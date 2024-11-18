import { IsString, IsUUID, MinLength } from "class-validator";

export class CreateEstacioneDto {

    @IsString()
    @MinLength(1)
    readonly nombre: string;
    
    @IsString()
    @MinLength(1)
    readonly ubicacion: string;

    @IsString()
    @MinLength(1)
    @IsUUID()
    readonly userAdminId: string;

}
