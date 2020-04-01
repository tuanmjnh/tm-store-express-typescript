import { Document, Schema, model } from 'mongoose';
import ICreated from '../created';
export interface ICategory extends Document {
  type: string;
  dependent: Schema.Types.ObjectId;
  level: number;
  title: string;
  code: string;
  desc: string;
  content: string;
  url: string;
  images: string;
  quantity: number;
  position: any[];
  tags: any[];
  icon: string;
  color: string;
  meta: any[];
  start_at: Date;
  end_at: Date;
  orders: number;
  flag: number;
  created: ICreated;
}
const schema: Schema = new Schema({
  type: { type: String, required: true },
  dependent: { type: Schema.Types.ObjectId, default: null },
  level: { type: Number, default: 1 },
  title: { type: String, required: true },
  code: { type: String, required: true, uppercase: true },
  desc: { type: String, default: null },
  content: { type: String, default: null },
  url: { type: String, default: null },
  images: { type: String, default: null },
  quantity: { type: Number, default: null },
  position: { type: Array, default: [1] },
  tags: { type: Array, default: null },
  icon: { type: String, default: null },
  color: { type: String, default: null },
  meta: { type: Array, default: null },
  start_at: { type: Date, default: null },
  end_at: { type: Date, default: null },
  orders: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
});
export const MCategory = model<ICategory>('categories', schema);
schema.index({ code: 'text', title: 'text' });
export default MCategory;
