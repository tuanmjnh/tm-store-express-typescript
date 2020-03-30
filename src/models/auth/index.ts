import { Document, Schema, model } from 'mongoose';
export interface IAuth extends Document {
  email: string;
  password: string;
  remember: boolean;
  token: string;
}
const schema: Schema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  remember: { type: Boolean, default: false },
  token: { type: String, required: true },
});
export default model<IAuth>('auth', schema);
