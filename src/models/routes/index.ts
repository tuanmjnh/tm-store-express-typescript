import { Document, Schema, model } from 'mongoose';
import ICreated from '../created';
export interface IRoute extends Document {
  path: string;
  name: string;
  component: string;
  dependent: Schema.Types.ObjectId;
  level: number;
  redirect: string;
  orders: number;
  meta: any[];
  flag: number;
  children: any[];
  created: ICreated;
}
const schema = new Schema({
  path: { type: String, required: true },
  name: { type: String, required: true },
  component: { type: String, required: true },
  dependent: { type: mongoose.Schema.Types.ObjectId, default: null },
  level: { type: Number, default: 1 },
  redirect: { type: String, default: null },
  // title: { type: String, default: null },
  // icon: { type: String, default: null },
  orders: { type: Number, default: 1 },
  // hidden: { type: Boolean, default: false },
  meta: { type: Array, default: { title: '', icon: '', hidden: false } },
  flag: { type: Number, default: 1 },
  children: { type: Array, default: null },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
});
export default model<IRoute>('routes', schema);
