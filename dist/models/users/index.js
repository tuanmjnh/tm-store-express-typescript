"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
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
    gender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'types' },
    address: { type: String, default: null },
    roles: { type: Array, default: null },
    verified: { type: Boolean, default: false },
    enable: { type: Boolean, default: true },
    last_login: { type: Date, default: null },
    last_change_pass: { type: Date, default: null },
    created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
});
exports.MUser = mongoose_1.model('users', schema);
exports.default = exports.MUser;
//# sourceMappingURL=index.js.map