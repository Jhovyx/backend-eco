import { IsString, MinLength } from "class-validator"

export class UpdatePasswordDTO {
    @IsString()
    @MinLength(6)
    readonly oldPassword: string

    @IsString()
    @MinLength(6)
    readonly newPassword: string
}