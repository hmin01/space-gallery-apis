// AWS
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// Handler
import { getPhotoInfo } from "./handler";

// 클라이언트 생성
const client = new DynamoDBClient({});
// DynamoDB 데이터 유형을 JavaScript 데이터 유형으로 변환하여 CRUD를 수행할 수 있도록 래핑(Wrapping) 라이브러리를 통한 클라이언트 객체 생성
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async () => {
  try {
    // 타임존(Timezone) 설정
    process.env.TZ = "Asia/Seoul";
    // 현재 날짜
    const today = new Date();
    // 시간 초기화
    today.setHours(0, 0, 0, 0);
    // 현재 날짜에 대한 문자열 (YYYY-MM-DD)
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1 > 9 ? today.getMonth() + 1 : "0" + (today.getMonth() + 1)}-${today.getDate() > 9 ? today.getDate() : "0" + today.getDate()}`;

    // 존재 여부 확인
    if (await getPhotoInfo(dynamodb, today.getTime())) throw new Error("Already item");

    // 사진 저장
    await createPhoto(dynamodb, todayStr);
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
  }
}