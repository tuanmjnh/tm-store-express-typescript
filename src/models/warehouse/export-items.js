const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  export: { type: mongoose.Schema.Types.ObjectId, ref: 'product_exports', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  price: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 }
})
module.exports = mongoose.model('product_export_items', schema)
