import { Module } from '@nestjs/common';
import { EstacionesService } from './estaciones.service';
import { EstacionesController } from './estaciones.controller';
import { ActivitiesModule } from 'src/activities/activities.module';
import { UsersModule } from 'src/users/users.module';
import { DynamodbModule } from 'src/dynamodb/dynamodb.module';

@Module({
  controllers: [EstacionesController],
  providers: [EstacionesService],
  imports: [DynamodbModule,ActivitiesModule,UsersModule],
  exports: [EstacionesService]
})
export class EstacionesModule {}
