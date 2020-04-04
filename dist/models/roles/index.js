"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    key: { type: String, required: true },
    name: { type: String, required: true },
    desc: { type: String, default: null },
    level: { type: Number, default: 1 },
    color: { type: String, default: '#027be3' },
    routes: { type: Array, default: null },
    flag: { type: Number, default: 1 },
    created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
});
exports.MRole = mongoose_1.model('roles', schema);
exports.default = exports.MRole;
//# sourceMappingURL=index.js.map