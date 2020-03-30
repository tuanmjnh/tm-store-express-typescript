import { Document, Schema, model } from 'mongoose';
export interface IUserSetting extends Document {
  user_id: Schema.Types.ObjectId;
  language: string;
  font: any;
  dense: any;
  format: any;
  darkMode: boolean;
}
const schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'users' },
  language: { type: String, default: 'vi-VN' },
  font: {
    type: Object,
    default: {
      size: 14,
      family: '"Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif',
      color: '#6b6b6b',
    },
  },
  dense: {
    type: Object,
    default: {
      form: true,
      button: true,
      input: true,
      table: true,
      menu: false,
    },
  },
  format: {
    type: Object,
    default: {
      date: 'DD/MM/YYYY',
      time: 'hh:mm:ss',
    },
  },
  darkMode: { type: Boolean, default: false },
});
export default model<IUserSetting>('userSetting', schema);
