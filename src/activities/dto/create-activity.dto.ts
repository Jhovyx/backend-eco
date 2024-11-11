import { IsString, IsUUID, MinLength } from "class-validator";

export class CreateActivityDto {
    
    @IsString()
    @MinLength(1)
    @IsUUID()
    readonly userId: string;
    
    @IsString()
    @MinLength(1)
    readonly activityType: string;
    
    @IsString()
    @MinLength(1)
    readonly detail: string;

    @IsString()
    readonly ip: string;
<<<<<<< HEAD

=======
>>>>>>> df1c3df7a7035aa27914e3667f3624807d011e48
}
