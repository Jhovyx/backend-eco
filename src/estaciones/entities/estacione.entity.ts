import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Estacion {

    @Field()
    primaryKey: string;

    @Field()
    nombre: string;

    @Field()
    ubicacion: string;

    @Field()
    userAdminId: string;

    @Field(() => Boolean)
    estado: Boolean;

    @Field(() => Int)
    createdAt: number;

    @Field(() => Int, { nullable: true })
    updatedAt?: number;

}
