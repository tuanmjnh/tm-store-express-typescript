const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  c: { type: String, required: true },
  cid: { type: mongoose.Schema.Types.ObjectId, required: true },
  func: { type: String, required: true },
  at: { type: Date, required: true },
  by: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  ip: { type: String, required: true },
  com: { type: String, required: true }
});
module.exports = mongoose.model('logs', schema);
