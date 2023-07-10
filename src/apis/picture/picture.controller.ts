import { Controller, Param, Res } from '@nestjs/common';
// Express
import { Response } from 'express';
// Interface
import { Picture, PictureImage } from './picture.interface';
// Method
import { Get } from '@nestjs/common';
// Service
import { PictureService } from './picture.service';

@Controller('picture')
export class PictureController {
  constructor(private pictureService: PictureService) {}

  @Get('/image/list')
  async getImages(): Promise<PictureImage[]> {
    // URL 조회
    const list: Picture[] = await this.pictureService.findMany();
    // 리다이렉션
    return list.map((elem: Picture): PictureImage => ({ date: elem.date, id: elem.id, url: elem.url }));
  }

  @Get('/image/:date')
  async getImage(@Param('date') date: string, @Res() res: Response): Promise<any> {
    // URL 조회
    const url: string = await this.pictureService.getImageUrl(date);
    // 리다이렉션
    res.redirect(url);
  }

  @Get('/info/list')
  findMany(): Promise<Picture[]> {
    return this.pictureService.findMany();
  }

  @Get('/info/:date')
  find(@Param('date') date: string): Promise<Picture> {
    return this.pictureService.findByDate(date);
  }
}
