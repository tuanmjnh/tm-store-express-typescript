import { Document, Schema, model } from 'mongoose';
export interface IProductExportItems extends Document {
  key: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  price: number;
  quantity: number;
  amount: number;
}
const schema = new Schema({
  key: { type: Schema.Types.ObjectId, ref: 'product_exports', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'products', required: true },
  price: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
});
export default model<IProductExportItems>('productExportItems', schema);
