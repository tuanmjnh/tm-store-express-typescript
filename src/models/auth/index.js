const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  email: String,
  password: String,
  remember: { type: Boolean, default: false },
  token: String
});
module.exports = mongoose.model('auth', schema);
