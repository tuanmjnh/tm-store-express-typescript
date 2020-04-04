"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
exports.getBody = (obj, req) => {
    // req: Request
    const rs = {};
    Object.keys(obj).forEach((e) => {
        if (req.body && req.body[e] !== undefined)
            rs[e] = req.body[e];
    });
    return rs;
};
exports.toTimestamp = (strDate) => {
    const datum = Date.parse(strDate);
    return datum / 1000;
};
exports.ToUpperCase = (obj) => {
    const rs = {};
    Object.keys(obj).forEach(e => {
        rs[e.toUpperCase()] = obj[e];
    });
    return rs;
};
exports.ToLowerCase = (obj) => {
    const rs = {};
    Object.keys(obj).forEach(e => {
        rs[e.toLowerCase()] = obj[e];
    });
    return rs;
};
exports.RandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
exports.ToDate = (timestamp, format = '') => {
    if (format) {
        return moment_1.default(timestamp).format(format);
    }
    else {
        return moment_1.default(timestamp).toDate();
    }
};
exports.pushIfNotExist = (data, element, key) => {
    if (Array.isArray(element)) {
        element.forEach(e => {
            if (key) {
                if (data.findIndex((x) => x[key] === e[key]) < 0)
                    data.push(e);
            }
            else {
                if (data.indexOf(e) < 0)
                    data.push(e);
            }
        });
    }
    else {
        if (key) {
            if (data.findIndex((x) => x[key] === element[key]) < 0)
                data.push(element);
        }
        else {
            if (data.indexOf(element) < 0)
                data.push(element);
        }
    }
    return data;
};
//# sourceMappingURL=helpers.js.map