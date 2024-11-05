import { IsEmail, IsIn, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    
    @IsString()
    @MinLength(1)
    @Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)
    readonly firstName: string;
    
    @IsString()
    @MinLength(1)
    @Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)
    readonly lastName: string;

    @IsString()
    @MinLength(3)
    @MaxLength(9)
    @IsIn(['DNI', 'RUC', 'PASAPORTE'])
    readonly documentType: string;

    @IsString()
    @MinLength(5)
    @MaxLength(11)
    @Matches(/^\d{8}$|^\d{11}$|^[A-Z0-9]{6,9}$/)
    readonly documentNumber: string;
    
    @IsString()
    @MinLength(9)
    @MaxLength(9)
    @Matches(/^\d{9}$/)
    readonly phoneNumber: string;

    @IsString()
    @MinLength(1)
    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(6)
    readonly password: string;

    @IsOptional()
    @IsString()
    readonly profilePictureUrl?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @IsUUID()
    readonly userAdminId?: string;
}
