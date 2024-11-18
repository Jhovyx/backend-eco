import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Bus {
  
  @Field()
  primaryKey: string;

  @Field()
  placa: string;

  @Field()
  modelo: string;

  @Field(() => Int)
  capacidad: number;

  @Field()
  userAdminId: string;

  @Field(() => Boolean)
  estado: Boolean;

  @Field(() => Int)
  createdAt: number;

  @Field(() => Int, { nullable: true })
  updatedAt?: number;

}
