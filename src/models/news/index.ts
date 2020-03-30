import { Document, Schema, model } from 'mongoose';
import ICreated from '../created';
export interface INews extends Document {
  categories: Schema.Types.ObjectId;
  title: string;
  code: string;
  desc: string;
  content: string;
  url: string;
  images: string;
  author: string;
  date: Date;
  pin: string[];
  tags: string[];
  attr: any[];
  meta: any[];
  attach: any[];
  start_at: Date;
  end_at: Date;
  orders: number;
  flag: number;
  created: ICreated;
}
const schema: Schema = new Schema({
  // type: { type: String, default: null },
  categories: { type: Schema.Types.ObjectId, ref: 'categories' },
  title: { type: String, required: true },
  code: { type: String, default: null, uppercase: true },
  desc: { type: String, default: null },
  content: { type: String, default: null },
  url: { type: String, default: null },
  images: { type: String, default: null },
  author: { type: String, default: null },
  date: { type: Date, default: null },
  pin: { type: Array, default: null },
  tags: { type: Array, default: null },
  attr: { type: Array, default: null },
  meta: { type: Array, default: null },
  attach: { type: Array, default: null },
  start_at: { type: Date, default: null },
  end_at: { type: Date, default: null },
  orders: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
});
export default model<INews>('news', schema);
schema.index({ code: 'text', title: 'text', author: 'text' });
