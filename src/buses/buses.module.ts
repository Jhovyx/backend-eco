import { Module } from '@nestjs/common';
import { BusesService } from './buses.service';
import { BusesController } from './buses.controller';
import { DynamodbModule } from 'src/dynamodb/dynamodb.module';
import { ActivitiesModule } from 'src/activities/activities.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [BusesController],
  providers: [BusesService],
  imports: [DynamodbModule,ActivitiesModule,UsersModule],
  exports: [BusesService]
})
export class BusesModule {}
