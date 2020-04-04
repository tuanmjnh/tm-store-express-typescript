"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    path: { type: String, required: true },
    name: { type: String, required: true },
    component: { type: String, required: true },
    dependent: { type: mongoose_1.Schema.Types.ObjectId, default: null },
    level: { type: Number, default: 1 },
    redirect: { type: String, default: null },
    // title: { type: String, default: null },
    // icon: { type: String, default: null },
    orders: { type: Number, default: 1 },
    // hidden: { type: Boolean, default: false },
    meta: { type: Array, default: { title: '', icon: '', hidden: false } },
    flag: { type: Number, default: 1 },
    children: { type: Array, default: null },
    created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
});
exports.MRoute = mongoose_1.model('routes', schema);
exports.default = exports.MRoute;
//# sourceMappingURL=index.js.map