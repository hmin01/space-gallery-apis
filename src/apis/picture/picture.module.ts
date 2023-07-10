import { Module } from '@nestjs/common';
// Controller
import { PictureController } from './picture.controller';
// Module
import { HttpModule } from '@nestjs/axios';
// Provider
import { ApiConfigProvider } from '../../configs/api.config';
// Repository
import { NasaApiRepository } from '../api.repository';
import { PictureRepository } from './picture.repository';
// Service
import { PictureService } from './picture.service';

@Module({
  imports: [HttpModule.registerAsync({ useClass: ApiConfigProvider })],
  controllers: [PictureController],
  providers: [PictureService, NasaApiRepository, PictureRepository]
})
export class PictureModule {}
