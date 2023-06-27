import { Injectable } from '@nestjs/common';
// DynamoDB
import * as dynamoose from 'dynamoose';
// Service
import { ConfigService } from '@nestjs/config';
// Type
import type { DynamoDB } from "@aws-sdk/client-dynamodb";

@Injectable()
export class DynamodbService {
  private ddb: DynamoDB;

  constructor(private configService: ConfigService) {
    // Create
    const ddb = new dynamoose.aws.ddb.DynamoDB({
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: configService.get<string>('AWS_SECRET_KEY')
      },
      region: configService.get<string>('AWS_REGION', 'ap-northeast-2')
    });
    // Set
    dynamoose.aws.ddb.set(ddb);
  }
}
