import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DynamodbModule } from 'src/dynamodb/dynamodb.module';
import { ActivitiesModule } from 'src/activities/activities.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [DynamodbModule,ActivitiesModule],
  exports: [UsersService]
})
export class UsersModule {}
