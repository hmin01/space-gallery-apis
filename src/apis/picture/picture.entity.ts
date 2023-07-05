import { model, Schema } from 'dynamoose';
// Interface
import { Picture } from './picture.interface';

const PictureSchema = new Schema({
  date: {
    required: true,
    type: String
  },
  explanation: String,
  id: {
    hashKey: true,
    required: true,
    type: String
  },
  timestamp: Number,
  title: String,
  url: String
});

export const PictureModel = model<Picture>('Picture', PictureSchema, { create: true, waitForActive: true });