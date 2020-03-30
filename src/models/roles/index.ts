import { Document, Schema, model } from 'mongoose';
import ICreated from '../created';
export interface IRole extends Document {
  key: string;
  name: string;
  desc: string;
  level: number;
  color: string;
  routes: string[];
  flag: number;
  created: ICreated;
  // type: 'personal',
  // order: 1,
}
const schema = new Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  desc: { type: String, default: null },
  level: { type: Number, default: 1 },
  color: { type: String, default: '#027be3' },
  routes: { type: Array, default: null },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
  // type: 'personal',
  // order: 1,
});
export default model<IRole>('products', schema);
