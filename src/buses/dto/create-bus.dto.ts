import { IsNumber, IsString, Min, MinLength } from "class-validator"

export class CreateBusDto {
    
    @IsString()
    @MinLength(1)
    readonly licensePlate
    
    @IsNumber()
    @Min(1)
    readonly capacity
}
