import { Document, Schema, model } from 'mongoose';
export interface ILog extends Document {
  c: string;
  cid: Schema.Types.ObjectId;
  func: string;
  at: Date;
  by: Schema.Types.ObjectId;
  ip: string;
  com: string;
}
const schema: Schema = new Schema({
  c: { type: String, required: true },
  cid: { type: Schema.Types.ObjectId, required: true },
  func: { type: String, required: true },
  at: { type: Date, required: true },
  by: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  ip: { type: String, required: true },
  com: { type: String, required: true },
});
export default model<ILog>('logs', schema);
