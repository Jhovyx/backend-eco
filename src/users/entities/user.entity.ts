import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {

    @Field()
    primaryKey: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    documentType: string;

    @Field()
    documentNumber: string;

    @Field()
    phoneNumber: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field({ nullable: true })
    profilePictureUrl?: string;

    @Field()
    userType: string;  // "cargo" in English

    @Field(() => Boolean)
    status: Boolean;

    @Field(() => Int)
    createdAt: number;

    @Field(() => Int, { nullable: true })
    updatedAt?: number;
}
