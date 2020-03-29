const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const schema = new mongoose.Schema({
  email: String,
  password: String,
  salt: String,
  full_name: String,
  phone: String,
  person_number: String,
  region: { type: String, default: 'vi-vn' },
  avatar: { type: String, default: null },
  note: { type: String, default: null },
  date_birth: { type: Date, default: null },
  gender: { type: mongoose.Schema.Types.ObjectId, ref: 'types' },
  address: String,
  roles: { type: Array, default: null },
  verified: { type: Boolean, default: false },
  enable: { type: Boolean, default: true },
  last_login: { type: Date, default: null },
  last_change_pass: { type: Date, default: null },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } }
});
module.exports = mongoose.model('users', schema);
