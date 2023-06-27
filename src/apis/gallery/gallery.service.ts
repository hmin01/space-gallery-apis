import { Injectable } from '@nestjs/common';
// Interface
import { GalleryInfo } from './gallery.interface';
// Repository
import { NasaApiRepository } from '../api.repository';

@Injectable()
export class GalleryService {
  constructor (private readonly nasaApiRepository: NasaApiRepository) {}

  /**
   * [Method] 갤러리 정보 조회
   * @param key 식별 키(= Date)
   * @returns 조회 결과
   */
  async get(key: string): Promise<GalleryInfo> {
    try {
      // API를 통한 조회
      const { data } = await this.nasaApiRepository.getInfo(key);
      // 결과 반환
      return { explanation: data.explanation, title: data.title, url: data.url };
    } catch (err: any) {
      this.nasaApiRepository.catchError(err)
    }
  }
  /**
   * [Method] 이미지 URL 반환
   * @param key 식별 키 (= Date)
   * @returns 조회 결과
   */
  async getImageUrl(key: string): Promise<string> {
    // 데이터 조회
    const { url } = await this.get(key);
    // 이미지 URL 반환
    return url;
  }
}
