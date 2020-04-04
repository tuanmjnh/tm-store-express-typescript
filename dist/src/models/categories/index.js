"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    type: { type: String, required: true },
    dependent: { type: mongoose_1.Schema.Types.ObjectId, default: null },
    level: { type: Number, default: 1 },
    title: { type: String, required: true },
    code: { type: String, required: true, uppercase: true },
    desc: { type: String, default: null },
    content: { type: String, default: null },
    url: { type: String, default: null },
    images: { type: String, default: null },
    quantity: { type: Number, default: null },
    position: { type: Array, default: [1] },
    tags: { type: Array, default: null },
    icon: { type: String, default: null },
    color: { type: String, default: null },
    meta: { type: Array, default: null },
    start_at: { type: Date, default: null },
    end_at: { type: Date, default: null },
    orders: { type: Number, default: 1 },
    flag: { type: Number, default: 1 },
    created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
});
exports.MCategory = mongoose_1.model('categories', schema);
schema.index({ code: 'text', title: 'text' });
exports.default = exports.MCategory;
//# sourceMappingURL=index.js.map