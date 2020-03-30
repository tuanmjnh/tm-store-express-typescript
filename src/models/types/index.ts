import { Document, Schema, model } from 'mongoose';
import ICreated from '../created';
export interface IType extends Document {
  key: string;
  code: string;
  name: string;
  desc: string;
  meta: any[];
  orders: number;
  flag: number;
  created: ICreated;
}
const schema = new Schema({
  key: { type: String, required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  desc: { type: String, default: null },
  meta: { type: Array, default: null },
  orders: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
});
export default model<IType>('types', schema);
