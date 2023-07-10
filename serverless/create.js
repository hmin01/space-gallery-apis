import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
// Axios
import axios from "axios";
// Utiltites
import jimp from "jimp";
import md5 from "md5";

// 클라이언트 생성
const client = new DynamoDBClient({});
// DynamoDB 데이터 유형을 JavaScript 데이터 유형으로 변환하여 CRUD를 수행할 수 있도록 래핑(Wrapping) 라이브러리를 통한 클라이언트 객체 생성
const dynamodb = DynamoDBDocumentClient.from(client);

/** 메인 이벤트 핸들러 */
export const handler = async (event) => {
  try {
    // 타임존(Timezone) 설정
    process.env.TZ = "Asia/Seoul";
    // 현재 날짜
    const today = new Date();
    // 현재 날짜에 대한 문자열 (YYYY-MM-DD)
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1 > 9 ? today.getMonth() + 1 : "0" + (today.getMonth() + 1)}-${today.getDate() > 9 ? today.getDate() : "0" + today.getDate()}`;

    // 데이터 존재 여부 확인
    if (await isExist(todayStr)) {
      console.log("Already items");
      return;
    }
    // 데이터 생성 절차 진행
    const { data, status } = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&date=${todayStr}`);
    // 예외 처리
    if (!data || status >= 400) throw new Error("Nasa API error");

    // Key
    const key = data.date;
    // 미디어 타입이 이미지인 경우에만 처리
    if (data.media_type !== "image") throw new Error("Invalid media type");
    
    // 이미지 DataUrl 생성
    const image = await jimp.read(data.url);
    // 이미지 변환
    image.resize(8, 6, jimp.RESIZE_BEZIER);
    // Base64 변환
    const dataUrl = await image.getBase64Async(jimp.AUTO);
    
    // 명령 생성
    const command = new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        dataUrl,
        date: key,
        explanation: data.explanation,
        id: md5(key),
        timestamp: new Date(key).getTime() / 1000,
        title: data.title,
        url: data.url,
      }
    });
    // 데이터 저장
    await dynamodb.send(command);
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
  }
};

async function isExist(date) {
  // 데이터 조회를 위한 명령 생성
  const command = new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: {
      id: md5(date)
    }
  });
  // 데이터 조회
  const result = await dynamodb.send(command);
  // 결과 반환
  return result.Item ? true : false;
}