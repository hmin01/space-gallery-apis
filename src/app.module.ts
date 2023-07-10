import { Module } from '@nestjs/common';
// Config
import { envConfig } from './configs/env.config';
// Module
import { ConfigModule } from '@nestjs/config';
import { DynamodbModule } from './dynamodb/dynamodb.module';
import { PictureModule } from './apis/picture/picture.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    DynamodbModule,
    PictureModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
