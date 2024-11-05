import { Module } from '@nestjs/common';
import { DynamodbService } from './dynamodb.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [DynamodbService],
  exports: [DynamodbService],
  imports: [ConfigModule]
})
export class DynamodbModule {}
