"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    // type: { type: String, default: null },
    categories: { type: mongoose_1.Schema.Types.ObjectId, ref: 'categories', required: true },
    title: { type: String, required: true },
    code: { type: String, required: true, uppercase: true },
    desc: { type: String, default: null },
    content: { type: String, default: null },
    images: { type: Array, default: null },
    quantity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    price_discount: { type: Number, default: 0 },
    price_import: { type: Number, default: 0 },
    price_export: { type: Number, default: 0 },
    price_unit: { type: String, default: null },
    unit: { type: String, default: null },
    origin: { type: String, default: null },
    date: { type: String, default: null },
    pin: { type: Array, default: null },
    tags: { type: Array, default: null },
    attr: { type: Array, default: null },
    meta: { type: Array, default: null },
    // start_at: { type: Date, default: null },
    // end_at: { type: Date, default: null },
    order: { type: Number, default: 1 },
    flag: { type: Number, default: 1 },
    created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
});
exports.MProduct = mongoose_1.model('products', schema);
schema.index({ code: 'text', title: 'text', author: 'text' });
exports.default = exports.MProduct;
// module.exports = mongoose.model('products', schema);
//# sourceMappingURL=index.js.map