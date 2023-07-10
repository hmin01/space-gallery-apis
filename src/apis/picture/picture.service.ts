import { Injectable } from '@nestjs/common';
// Exception
import { NotAcceptableException } from '@nestjs/common/exceptions';
// Interface
import { Picture } from './picture.interface';
// Repository
import { NasaApiRepository } from '../api.repository';
import { PictureRepository } from './picture.repository';

@Injectable()
export class PictureService {
  constructor(private readonly nasaApiRepository: NasaApiRepository, private pictureRepository: PictureRepository) {}

  /**
   * [Method] 갤러리 정보 조회
   * @param date 날짜 (YYYY-MM-DD)
   * @returns 조회 결과
   */
  async findByDate(date: string): Promise<Picture> {
    // 데이터베이스에 저장되어 있는지 확인
    const picture = await this.pictureRepository.find(date, false);
    // 조회 결과가 있을 경우, 해당 정보 반환
    if (picture) return picture;

    // 데이터 요청
    const { data } = await this.nasaApiRepository.getInfo(date);
    // 타입이 이미지일 경우에만 처리
    if (data.media_type === 'image') {
      // 결과 저장 및 반환
      return await this.pictureRepository.create({ date: data.date, explanation: data.explanation, title: data.title, url: data.url });
    } else {
      throw new NotAcceptableException();
    }
  }
  /**
   * [Method] 사진 정보 목록 조회
   * @param limit 목록 수
   * @param id 시작 지점 정보 ID
   * @returns 조회 결과
   */
  async findMany(limit: number = 100, id?: string): Promise<Picture[]> {
    // 데이터 조회
    const list: Picture[] = await this.pictureRepository.findMany(limit, id);
    // 정렬 및 반환
    return list.sort((a: Picture, b: Picture): number => b.timestamp - a.timestamp);
  }
  /**
   * [Method] 이미지 URL 반환
   * @param date 날짜 (YYYY-MM-DD)
   * @returns 조회 결과
   */
  async getImageUrl(date: string): Promise<string> {
    // 데이터 조회
    const { url } = await this.findByDate(date);
    // 이미지 URL 반환
    return url;
  }
}
