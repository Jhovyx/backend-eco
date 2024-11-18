import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Viaje {

    @Field()
    primaryKey: string;

    @Field()
    urlImagen: string;

    @Field()
    nombre: string;

    @Field()
    descripcion: string;

    @Field({ nullable: true })
    costo?: number;

    @Field()
    userAdminId: string; //relacion con el administrador

    @Field()
    idBus: string;  // Relación con el bus

    @Field()
    idEstacionOrigen: string; //relacion con la estacion de origen

    @Field()
    idEstacionDestino: string; //relacion con la estacion de llagada

    @Field(() => Int)
    fechaHoraSalida: number;

    @Field(() => Int)
    fechaHoraLlegada: number;

    @Field(() => Boolean, { nullable: true })
    estado?: Boolean;

    @Field(() => Int)
    createdAt: number;

    @Field(() => Int, { nullable: true })
    updatedAt?: number;

    @Field(() => Boolean, { nullable: true })
    statusPromo?: boolean;

    @Field(() => Int, { nullable: true })
    descuentoPorcentaje?: number;
}
