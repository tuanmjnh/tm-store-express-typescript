const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  // type: { type: Number, required: true }, // 1 Import; 2 Export
  code: { type: String, required: true, lowercase: true },
  total_product: { type: Number, default: 0 },
  total_price: { type: Number, default: 0 },
  total_quantity: { type: Number, default: 0 },
  created_at: { type: Date, default: new Date() },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  created_ip: { type: String, default: null },
  flag: { type: Number, default: 1 }
})
module.exports = mongoose.model('product_exports', schema)
