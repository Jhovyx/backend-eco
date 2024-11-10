import { IsEmail, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength, IsUUID, Validate } from "class-validator";
import { IsValidDocumentNumberConstraint } from "../validations/validation-document";

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    @MinLength(1)
    @Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)
    readonly firstName?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)
    readonly lastName?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(7)
    @IsIn(['DNI', 'RUC', 'PASAPORTE'])
    readonly documentType?: string;

    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(11)
    @Matches(/^\d{8}$|^\d{11}$|^[A-Z0-9]{6,9}$/)
    @Validate(IsValidDocumentNumberConstraint)
    readonly documentNumber?: string;

    @IsOptional()
    @IsString()
    @MinLength(9)
    @MaxLength(9)
    @Matches(/^\d{9}$/)
    readonly phoneNumber?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @IsEmail()
    readonly email?: string;

    @IsOptional()
    @IsString()
    readonly profilePictureUrl?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @IsUUID()
    readonly userAdminId?: string;
}
