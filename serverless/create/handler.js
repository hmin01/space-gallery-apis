// Axios
import axios from "axios";
// AWS
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
// Image transform
import jimp from "jimp";
// Utilities
import { transformToTimestamp } from "./utilities.mjs";

/**
 * [Function] 사진 저장
 * @param {DynamoDBDocumentClient} client DynamoDB Client
 * @param {string} date 날짜 형식 문자열 (YYYY-MM-DD)
 * @returns {Promise<string>} 응답 메시지
 */
export async function createPhoto(client, date) {
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
  // 데이터 조회를 위한 명령
  const command = new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: { id }
  });
  // 데이터 조회
  const result = await client.send(command);
  // 결과 반환
  return result.Item ?? undefined;
}