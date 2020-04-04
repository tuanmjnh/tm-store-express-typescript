"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    // type: { type: String, default: null },
    categories: { type: mongoose_1.Schema.Types.ObjectId, ref: 'categories' },
    title: { type: String, required: true },
    code: { type: String, default: null, uppercase: true },
    desc: { type: String, default: null },
    content: { type: String, default: null },
    url: { type: String, default: null },
    images: { type: String, default: null },
    author: { type: String, default: null },
    date: { type: Date, default: null },
    pin: { type: Array, default: null },
    tags: { type: Array, default: null },
    attr: { type: Array, default: null },
    meta: { type: Array, default: null },
    attach: { type: Array, default: null },
    start_at: { type: Date, default: null },
    end_at: { type: Date, default: null },
    orders: { type: Number, default: 1 },
    flag: { type: Number, default: 1 },
    created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
});
exports.MNews = mongoose_1.model('news', schema);
schema.index({ code: 'text', title: 'text', author: 'text' });
exports.default = exports.MNews;
//# sourceMappingURL=index.js.map