import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { DynamodbModule } from 'src/dynamodb/dynamodb.module';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  imports: [DynamodbModule],
  exports: [ActivitiesService]
})
export class ActivitiesModule {}
