import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Bus {

  @Field()
  primaryKey: string;

  @Field()
  placa: string;

  @Field()
  model: string;

  @Field(() => Int)
  capacity: number;

  @Field(() => Boolean)
  estado: Boolean;

  @Field(() => Int)
  createdAt: number;

  @Field(() => Int, { nullable: true })
  updatedAt?: number;

}
