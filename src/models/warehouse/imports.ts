import { Document, Schema, model } from 'mongoose';
export interface IProductImport extends Document {
  code: string;
  product: number;
  quantity: number;
  price: number;
  vat: number;
  created_at: Date;
  created_by: Schema.Types.ObjectId;
  created_ip: string;
  flag: number;
}
const schema = new Schema({
  // type: { type: Number, required: true }, // 1 Import; 2 Export
  code: { type: String, required: true, lowercase: true },
  product: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  vat: { type: Number, default: 0 },
  created_at: { type: Date, default: new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: 'users' },
  created_ip: { type: String, default: null },
  flag: { type: Number, default: 1 },
});
export const MProductImport = model<IProductImport>('productImports', schema);
export default MProductImport;
