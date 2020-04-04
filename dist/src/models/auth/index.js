"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    remember: { type: Boolean, default: false },
    token: { type: String, required: true },
});
exports.MAuth = mongoose_1.model('auth', schema);
exports.default = exports.MAuth;
//# sourceMappingURL=index.js.map