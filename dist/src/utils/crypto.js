"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const SECRET = '48955e33-5871-3982-3c1e-e127e7714958';
exports.MD5Hash = value => {
    return crypto_1.createHash('md5')
        .update(value + SECRET)
        .digest('hex');
};
exports.NewGuid = (otps) => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    if (otps && otps.toLowerCase() === 'n') {
        return `${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}`;
    }
    else {
        return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    }
};
//# sourceMappingURL=crypto.js.map