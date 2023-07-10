import * as dayjs from 'dayjs';

/**
 * [Function] 타임스탬프 반환
 * @param date 날짜 형식 문자열 (YYYY-MM-DD)
 * @returns 유닉스 타임스탬프
 */
export function extractTimestamp(date: string): number {
  return dayjs(date).set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0).unix();
}

/**
 * [Function] 날짜 형식 문자열 반환
 * @param day 기준일로부터의 Day
 * @returns 날짜 형식 문자열 (YYYY-MM-DD)
 */
export function getDate(day?: number): string {
  return day ? dayjs().add(day, 'day').format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
}