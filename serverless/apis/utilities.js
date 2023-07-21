/**
 * [Function] 타임스탬프를 날짜 형식 문자열로 변환
 * @param {string} timestamp 유닉스 타임스탬프
 * @returns {string} 날짜 형식 문자열 (YYYY-MM-DD)
 */
export function transformToDateFormat(timestamp) {
  // 날짜 객체 생성
  const date = new Date(timestamp * 1000);
  // 날짜 형식 문자열 반환
  return `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)}-${date.getDate() > 9 ? date.getDate() : "0" + date.getDate()}`;
}
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
/**
 * [Function] 날짜 형식(YYYY-MM-DD)에 대한 유효성 확인
 * @param {string} date 날짜 형식 문자열 (YYYY-MM-DD)
 * @returns {boolean} 유효성 확인 결과
 */
export function validateDateFormat(date) {
  return !isNaN(Date.parse(date));
}