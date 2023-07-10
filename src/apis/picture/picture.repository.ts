import { Injectable } from '@nestjs/common';
// Exception
import { InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
// Interface
import { CreatePictureDto, Picture } from './picture.interface';
// Model
import { PictureModel } from './picture.entity';
// Utilities
import * as md5 from 'md5';
import { extractTimestamp } from 'src/utilities/date';

@Injectable()
export class PictureRepository {
  /**
   * [Method] 사진 정보 생성
   * @param input 사진 정보
   * @returns 요청 결과
   */
  async create(input: CreatePictureDto): Promise<Picture> {
    try {
      // 객체 생성
      const picture = new PictureModel({ id: md5(input.date), timestamp: extractTimestamp(input.date), ...input });
      // 객체 저장 및 반환
      await picture.save();
      // 생성된 객체 반환
      return picture;
    } catch (err: any) {
      console.error('[ERROR]', err.message);
      throw new InternalServerErrorException();
    }
  }
  /**
   * [Method] 사진 정보 조회
   * @param date 식별을 위한 날짜
   * @param isCatchError 예외 처리 여부
   * @returns 조회 결과
   */
  async find(date: string, isCatchError: boolean = true): Promise<Picture> {
    // 데이터 조회
    const picture = await PictureModel.get(md5(date));
    // 예외 처리
    if (isCatchError && !picture) throw new NotFoundException();
    // 결과 반환
    return picture;
  }
  /**
   * [Method] 사진 정보 목록 조회
   * @param limit 목록 수
   * @param id 시작 지점 정보 ID
   * @returns 조회 결과
   */
  async findMany(limit: number = 100, id?: string): Promise<Picture[]> {
    return id ? PictureModel.scan().startAt({ id: id }).limit(limit).exec() : PictureModel.scan().limit(limit).exec();
  }
}