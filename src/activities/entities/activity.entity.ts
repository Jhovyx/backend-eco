import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Activity {
  @Field()
  primaryKey: string;

  @Field() 
  userId: string;

  @Field() 
  activityType: string;

  @Field(() => Int)
  createdAt: number;

  @Field() 
  detail: string;

  @Field()
  ip: string;
}
