"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    key: { type: String, required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    desc: { type: String, default: null },
    meta: { type: Array, default: null },
    orders: { type: Number, default: 1 },
    flag: { type: Number, default: 1 },
    created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
});
exports.MType = mongoose_1.model('types', schema);
exports.default = exports.MType;
//# sourceMappingURL=index.js.map