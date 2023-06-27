import { Item } from 'dynamoose/dist/Item';

export class CreatePictureDto {
  date: string;
  explanation: string;
  title: string;
  url: string;
}

export class Picture extends Item {
  date: string;
  id: string;
  explanation: string;
  timestamp: number;
  title: string;
  url: string;
}