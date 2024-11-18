import { Module } from '@nestjs/common';
import { DynamodbModule } from './dynamodb/dynamodb.module';
import { UsersModule } from './users/users.module';
import { ActivitiesModule } from './activities/activities.module';
import { BusesModule } from './buses/buses.module';
import { AsientosModule } from './asientos/asientos.module';
import { EstacionesModule } from './estaciones/estaciones.module';
import { ViajesModule } from './viajes/viajes.module';

@Module({
  imports: [DynamodbModule, UsersModule, ActivitiesModule, BusesModule, AsientosModule, EstacionesModule, ViajesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
