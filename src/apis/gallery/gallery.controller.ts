import { Controller, Param, Res } from '@nestjs/common';
// Express
import { Response } from 'express';
// Method
import { Get } from '@nestjs/common';
// Service
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @Get('/image/:date')
  async getImage(@Param('date') date: string, @Res() res: Response): Promise<any> {
    // URL 조회
    const url: string = await this.galleryService.getImageUrl(date);
    // 리다이렉션
    res.redirect(url);
  }

  @Get('/info/:date')
  find(@Param('date') date: string): Promise<any> {
    return this.galleryService.get(date);
  }
}
