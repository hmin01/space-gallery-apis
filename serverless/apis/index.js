import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
// Handler
import { createPhoto, getPhotoInfo, getPhotos } from "./handler.mjs";

// 클라이언트 생성
const client = new DynamoDBClient({});
// DynamoDB 데이터 유형을 JavaScript 데이터 유형으로 변환하여 CRUD를 수행할 수 있도록 래핑(Wrapping) 라이브러리를 통한 클라이언트 객체 생성
const dynamodb = DynamoDBDocumentClient.from(client);

/** 메인 이벤트 핸들러 */
export const handler = async (event) => {
  // 타임존(Timezone) 설정
  process.env.TZ = "Asia/Seoul";
  // 응답 바디
  let body;
  // 응답 헤더
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    // 명령 객체
    let param;
    // 경로에 따른 처리 프로세스
    switch (event.routeKey) {
      case "POST /photo/{timestamp}":
        // 경로 파라미터 추출
        param = event.pathParameters.timestamp;
        // 프로세스
        body = await createPhoto(dynamodb, param);
        break;
      case "GET /photo/{timestamp}":
        // 경로 파라미터 추출
        param = event.pathParameters.timestamp;
        // 프로세스
        body = await getPhotoInfo(dynamodb, param);
        break;
      case "GET /photos":
        body = await getPhotos(dynamodb);
        break;
      case "GET /photos/timestamp":
        body = await getPhotoTimestamps(dynamodb);
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