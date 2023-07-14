/**
 * [Function] 날짜 형식 문자열을 타임스탬프로 변환
 * @param {string} dateStr 날짜 형식 문자열 (YYYY-MM-DD)
 * @returns {number} 유닉스 타임스탬프
 */
export function transformToTimestamp(dateStr) {
  // 날짜 객체 생성
  const date = new Date(dateStr);
  // 시간 초기화
  date.setHours(0, 0, 0, 0);
  // 유닉스 타임스탬프 반환
  return date.getTime() / 1000;
}