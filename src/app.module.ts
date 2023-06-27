import { Module } from '@nestjs/common';
// Config
import { envConfig } from './configs/env.config';
// Module
import { ConfigModule } from '@nestjs/config';
import { GalleryModule } from './apis/gallery/gallery.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    GalleryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
