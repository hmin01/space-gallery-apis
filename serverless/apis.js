import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
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
  // 응답 바디
  let body;
  // 응답 헤더
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    // 명령 객체
    let param, command, result;
    // 경로에 따른 처리 프로세스
    switch (event.routeKey) {
      case "POST /picture/{date}":
        // 경로 파라미터 추출
        param = event.pathParameters.date;
        // 데이터 존재 여부 확인
        result = await findByDate(param);
        // 없을 경우, 데이터 생성 절차 진행
        if (!result) {
          const { data } = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&date=${param}`);
          if (data) {
            // 미디어 타입이 이미지인 경우에만 처리
            if (data.media_type !== "image") throw new Error("Invalid media type");
            
            // 이미지 DataUrl 생성
            const image = await jimp.read(data.url);
            // 이미지 변환
            image.resize(8, 6, jimp.RESIZE_BEZIER);
            // Base64 변환
            const dataUrl = await image.getBase64Async(jimp.AUTO);
            
            // 명령 생성
            command = new PutCommand({
              TableName: process.env.TABLE_NAME,
              Item: {
                dataUrl,
                date: data.date,
                explanation: data.explanation,
                id: md5(data.date),
                timestamp: new Date(data.date).getTime() / 1000,
                title: data.title,
                url: data.url,
              }
            });
            // 데이터 저장
            await dynamodb.send(command);
            // 응답 메시지
            body = "Created";
          } else {
            body = "Nasa API error";
          }
        } else {
          body = "Already items";
        }
        break;
      case "GET /picture/{date}":
        // 경로 파라미터 추출
        param = event.pathParameters.date;
        // 날짜 형식 문자열
        const date = getDateFormat(param);
        // 데이터 조회
        result = await findByDate(date);
        // 결과 반환
        if (result) body = result;
        break;
      case "GET /pictures":
        // 데이터 조회를 위한 명령 생성
        command = new ScanCommand({
          TableName: process.env.TABLE_NAME
        });
        // 데이터 조회
        result = await dynamodb.send(command);
        // 결과 반환
        if (result.Count) body = result.Items.sort((a, b) => b.timestamp - a.timestamp);
        else body = [];
        break;
      case "GET /pictures/timestamp":
        // 데이터 조회를 위한 명령 생성
        command = new ScanCommand({
          TableName: process.env.TABLE_NAME
        });
        // 데이터 조회
        result = await dynamodb.send(command);
        // 결과 가공 및 반환
        if (result.Count) body = result.Items.map((elem) => elem.timestamp).sort();
        else body = [];
        break;
      default:
        throw new Error(`Unsupported route: ${event.routeKey}`);
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: err.message,
      headers
    };
  } finally {
    body = JSON.stringify(body);
  }
  // 응답
  return {
    statusCode: 200,
    body,
    headers
  };
};

async function findByDate(date) {
  // 날짜 형식에 대한 유효성 확인
  if (!validateDateFormat(date)) throw new Error(`Invalid date format (${date})`);
  
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
  return result.Item ? result.Item : undefined;
}

function getDateFormat(timestamp) {
  // 날짜 객체 생성
  const date = new Date(timestamp * 1000);
  // 날짜 형식 문자열 반환
  return `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)}-${date.getDate() > 9 ? date.getDate() : "0" + date.getDate()}`;
}

function validateDateFormat(value) {
  return !isNaN(Date.parse(value));
}