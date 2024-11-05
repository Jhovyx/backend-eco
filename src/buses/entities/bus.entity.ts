import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Asiento } from 'src/asientos/entities/asiento.entity';

@ObjectType()
export class Bus {
  @Field(() => ID)
  id: string;

  @Field()
  licensePlate: string; //placa

  @Field()
  capacity: number; // Capacidad de pasajeros

  @Field()
  status: boolean;

  @Field(() => Int)
  createdAt: number;

  @Field(() => Int, { nullable: true })
  updatedAt?: number;
}
