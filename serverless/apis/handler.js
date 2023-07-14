// Axios
import axios from "axios";
// AWS
import { paginateScan } from "@aws-sdk/lib-dynamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
// Image transform
import jimp from "jimp";
// Utilities
import { transformToTimestamp, validateDateFormat } from "./utilities.mjs";

/**
 * [Function] 사진 저장
 * @param {DynamoDBDocumentClient} client DynamoDB Client
 * @param {string} date 날짜 형식 문자열 (YYYY-MM-DD)
 * @returns {Promise<string>} 응답 메시지
 */
export async function createPhoto(client, date) {
  // 데이터 존재 확인
  const info = getPhotoInfoByDate(client, date);
  // 데이터가 있을 경우
  if (info) return `Already a photo for date (${date})`;

  // NASA API 호출
  const { data } = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&date=${date}`);
  // 예외 처리
  if (!data) return "Nasa API error";
  // 이미지 타입 예외 처리
  if (data.media_type !== "image") return "Invalid media type";

  // 이미지 DataUrl 생성
  const image = await jimp.read(data.url);
  // 이미지 변환
  image.resize(8, 6, jimp.RESIZE_BEZIER);
  // Base64 변환
  const dataUrl = await image.getBase64Async(jimp.AUTO);

  // 정보 저장을 위한 명령 생성
  const command = new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      dataUrl,
      explanation: data.explanation,
      id: transformToTimestamp(date),
      title: data.title,
      url: data.url
    }
  });
  // 데이터 저장
  await client.send(command);
  // 저장 완료 메시지 반환
  return "Created";
}
/**
 * [Function] 사진 정보 조회
 * @param {DynamoDBDocumentClient} client DynamoDB Client
 * @param {number} id 사진 정보 ID (= timestamp)
 * @returns {Promise<any | undefined>} 사진 정보
 */
export async function getPhotoInfo(client, id) {
  // 데이터 조회를 위한 명령 생성
  const command = new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: { id }
  });
  // 데이터 조회
  const result = await client.send(command);
  // 결과 반환
  return result.Item ?? undefined;
}
/**
 * [Function] 사진 정보 조회 (날짜 이용)
 * @param {DynamoDBDocumentClient} client DynamoDB Client
 * @param {string} date 날짜 형식 문자열 (YYYY-MM-DD)
 * @returns {Promise<any>} 사진 정보
 */
export async function getPhotoInfoByDate(client, date) {
  // 날짜 형식에 대한 유효성 검사
  if (!validateDateFormat(date)) return `Invalid date format (${date})`;
  // 날짜 형식 문자열로 변환
  const timestamp = transformToTimestamp(date);

  // 데이터 조회 및 반환
  return getPhotoInfo(client, timestamp);
}
/**
 * [Function] 사진 목록 조회 (날짜 형식 문자열을 이용)
 * @param {DynamoDBDocumentClient} client DynamoBD Client
 * @returns {Promise<any[]>} 사진 목록
 */
export async function getPhotos(client) {
  // 페이지네이터(Paginator) 설정
  const config = {
    client,
    pageSize: 100
  };
  // 데이터 조회를 위한 파라미터
  const params = {
    TableName: process.env.TABLE_NAME
  };

  // 페이지네이터 생성
  const paginator = paginateScan(config, params);
  // 데이터 조회
  const items = [];
  for await (const page of paginator) {
    for (const item of page.Items) {
      items.push({
        dataUrl: item.dataUrl,
        id: item.id,
        title: item.title,
        url: item.url
      });
    }
  }
  return items;
}
/**
 * [Function] 사진에 대한 타임스탬프 목록 조회
 * @param {DynamoDBDocumentClient} client DynamoDB Client
 * @returns {Promise<string[]>} 타임스탬프 목록
 */
export async function getPhotoTimestamps(client) {
  // 데이터 조회
  const items = await getPhotos(client);
  // 데이터 가공
  const processed = items.map((item) => item.timestamp);
  // 가공 데이터 반환
  return processed;
}