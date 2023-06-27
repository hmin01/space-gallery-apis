import { Module } from '@nestjs/common';
// Controller
import { GalleryController } from './gallery.controller';
// Module
import { HttpModule } from '@nestjs/axios';
// Provider
import { ApiConfigProvider } from '../../configs/api.config';
// Repository
import { NasaApiRepository } from '../api.repository';
// Service
import { GalleryService } from './gallery.service';

@Module({
  imports: [HttpModule.registerAsync({ useClass: ApiConfigProvider })],
  controllers: [GalleryController],
  providers: [GalleryService, NasaApiRepository]
})
export class GalleryModule {}
