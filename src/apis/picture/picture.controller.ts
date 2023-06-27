import { Controller, Param, Res } from '@nestjs/common';
// Express
import { Response } from 'express';
// Method
import { Get } from '@nestjs/common';
// Service
import { PictureService } from './picture.service';
import { Picture } from './picture.interface';

@Controller('picture')
export class PictureController {
  constructor(private pictureService: PictureService) {}

  @Get('/image/:date')
  async getImage(@Param('date') date: string, @Res() res: Response): Promise<any> {
    // URL 조회
    const url: string = await this.pictureService.getImageUrl(date);
    // 리다이렉션
    res.redirect(url);
  }

  @Get('/info/list')
  findMany(): Promise<Picture[]> {
    return this.pictureService.findMany(10);
  }

  @Get('/info/:date')
  find(@Param('date') date: string): Promise<Picture> {
    return this.pictureService.findByDate(date);
  }
}
