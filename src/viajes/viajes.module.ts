import { Module } from '@nestjs/common';
import { ViajesService } from './viajes.service';
import { ViajesController } from './viajes.controller';
import { BusesModule } from 'src/buses/buses.module';
import { EstacionesModule } from 'src/estaciones/estaciones.module';
import { DynamodbModule } from 'src/dynamodb/dynamodb.module';
import { ActivitiesModule } from 'src/activities/activities.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ViajesController],
  providers: [ViajesService],
  imports: [DynamodbModule,BusesModule,EstacionesModule,ActivitiesModule,UsersModule]
})
export class ViajesModule {}
