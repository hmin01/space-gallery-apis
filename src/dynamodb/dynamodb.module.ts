import { Module } from '@nestjs/common';
// Service
import { DynamodbService } from './dynamodb.service';

@Module({
  providers: [DynamodbService]
})
export class DynamodbModule {}
