"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users', required: true },
    collName: { type: String, required: true },
    collId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    method: { type: String, required: true },
    userAgent: { type: String, required: true },
    at: { type: Date, default: new Date() },
    ip: { type: String, required: true },
});
exports.MLogger = mongoose_1.model('logger', schema);
exports.default = exports.MLogger;
//# sourceMappingURL=index.js.map