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

}
