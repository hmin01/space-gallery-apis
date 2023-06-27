import { Injectable } from '@nestjs/common';
// Exception
import { BadRequestException, InternalServerErrorException, RequestTimeoutException, UnauthorizedException } from '@nestjs/common/exceptions';
// Service
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
// Type
import type { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class NasaApiRepository {
  private readonly API_KEY: string;

  constructor(private configService: ConfigService, private httpService: HttpService) {
    this.API_KEY = configService.get<string>('NASA_API_KEY');
  }

  /**
   * [Method] 에러 처리
   * @param err 에러 객체
   */
  catchError(err: AxiosError, isReturn?: boolean): void {
    if (err.response) {
      // 메시지 추출
      const message: string | undefined = (err.response.data as any)?.msg;
      // 에러 객체
      let error: any;
      // 유형에 따른 처리      
      switch (err.response.status) {
        case 400:
          error = new BadRequestException(message);
          break;
        case 403:
          error = new UnauthorizedException(message);
          break;
        default:
          error = new InternalServerErrorException();
          break;
      }
      // 반환 여부에 따른 처리
      if (isReturn) return error;
      else throw error;
    } else if (err.code === 'ECONNABORTED') {
      throw new RequestTimeoutException();
    } else {
      throw new InternalServerErrorException();
    }
  }
  /**
   * [Method] GET Request
   * @param url URL
   * @returns 요청 결과
   */
  async get(url: string): Promise<any> {
    // 요청 처리
    const { data } = await firstValueFrom(this.httpService.get(url).pipe(catchError((err: AxiosError) => {
      throw this.catchError(err, true);
    })));
    // 결과 반환
    return data;
  }
  /**
   * [Method] GET Request
   * @param date 날짜 형식 문자열 (YYYY-MM-DD)
   * @returns 요청 결과
   */
  getInfo(date: string): Promise<any> {
    return this.httpService.axiosRef.get(this.createUrl(date));
  }

  private createUrl(date: string): string {
    return `/apod?api_key=${this.API_KEY}&date=${date}`;
  }
}