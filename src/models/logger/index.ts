import { Document, Schema, model } from 'mongoose';
export interface ILogger extends Document {
  userId: Schema.Types.ObjectId;
  collName: string;
  collId: Schema.Types.ObjectId;
  method: string;
  userAgent: string;
  at?: Date;
  ip: string;
}
const schema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  collName: { type: String, required: true },
  collId: { type: Schema.Types.ObjectId, required: true },
  method: { type: String, required: true },
  userAgent: { type: String, required: true },
  at: { type: Date, default: new Date() },
  ip: { type: String, required: true },
});
export const MLogger = model<ILogger>('logger', schema);
export default MLogger;
