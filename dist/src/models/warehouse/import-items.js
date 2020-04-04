"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    key: { type: mongoose_1.Schema.Types.ObjectId, ref: 'product_imports', required: true },
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'products', required: true },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
});
exports.MProductImportItems = mongoose_1.model('productImportItems', schema);
exports.default = exports.MProductImportItems;
//# sourceMappingURL=import-items.js.map