import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Boleta {
  @Field(type => Int)
  id: number;

  @Field()
  fechaEmision: Date;

  @Field()
  pasajero: string;

  @Field()
  cajero: string;

  @Field()
  detalleServicio: string;

  @Field()
  origen: string;

  @Field()
  destino: string;

  @Field()
  servicio: string;

  @Field()
  fechaViaje: Date;

  @Field()
  horaSalida: string;

  @Field()
  asiento: string;

  @Field()
  direccion: string;

  @Field()
  embarque: string;

  @Field()
  desembarque: string;
}

