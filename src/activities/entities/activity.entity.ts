import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Activity {
  @Field()
  primaryKey: string;

  @Field() 
  userId: string;

  @Field() 
  action: string;

  @Field(() => Int)
  createdAt: number;

  @Field() 
  detail: string;
}
