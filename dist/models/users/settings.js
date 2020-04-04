"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' },
    language: { type: String, default: 'vi-VN' },
    font: {
        type: Object,
        default: {
            size: 14,
            family: '"Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif',
            color: '#6b6b6b',
        },
    },
    dense: {
        type: Object,
        default: {
            form: true,
            button: true,
            input: true,
            table: true,
            menu: false,
        },
    },
    format: {
        type: Object,
        default: {
            date: 'DD/MM/YYYY',
            time: 'hh:mm:ss',
        },
    },
    darkMode: { type: Boolean, default: false },
});
exports.MUserSetting = mongoose_1.model('userSetting', schema);
exports.default = exports.MUserSetting;
//# sourceMappingURL=settings.js.map