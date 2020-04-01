import { Document, Schema, model } from 'mongoose';
import ICreated from '../created';
export interface IUser extends Document {
  email: string;
  password: string;
  salt: string;
  full_name: string;
  phone: string;
  person_number: string;
  region: string;
  avatar: string;
  note: string;
  date_birth: Date;
  gender: Schema.Types.ObjectId;
  address: string;
  roles: string[];
  verified: boolean;
  enable: boolean;
  last_login: Date;
  last_change_pass: Date;
  created: ICreated;
}
const schema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  full_name: { type: String, default: null },
  phone: { type: String, default: null },
  person_number: { type: String, default: null },
  region: { type: String, default: 'vi-vn' },
  avatar: { type: String, default: null },
  note: { type: String, default: null },
  date_birth: { type: Date, default: null },
  gender: { type: Schema.Types.ObjectId, ref: 'types' },
  address: { type: String, default: null },
  roles: { type: Array, default: null },
  verified: { type: Boolean, default: false },
  enable: { type: Boolean, default: true },
  last_login: { type: Date, default: null },
  last_change_pass: { type: Date, default: null },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
});
export const MUser = model<IUser>('users', schema);
export default MUser;
