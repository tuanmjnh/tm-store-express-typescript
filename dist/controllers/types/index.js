"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../services/logger"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
const mongoose_1 = require("mongoose");
const request_1 = require("../../utils/request");
const types_1 = require("../../models/types");
class TypesController {
    constructor() {
        this.path = '/types';
        this.select = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const conditions = { $and: [{ flag: req.query.flag ? req.query.flag : 1 }] };
                if (req.query.key)
                    conditions.$and.push({ key: req.query.key });
                if (req.query.filter) {
                    conditions.$and.push({
                        $or: [{ name: new RegExp(req.query.filter, 'i') }, { 'meta.title': new RegExp(req.query.filter, 'i') }]
                    });
                }
                if (!req.query.sortBy)
                    req.query.sortBy = 'orders';
                req.query.rowsNumber = yield types_1.MType.where(conditions).countDocuments();
                const options = {
                    skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
                    limit: parseInt(req.query.rowsPerPage),
                    sort: { key: 1, [req.query.sortBy || 'orders']: req.query.descending === 'true' ? -1 : 1 } // 1 ASC, -1 DESC
                };
                types_1.MType.find(conditions, null, options, (e, rs) => {
                    if (e)
                        return res.status(500).send(e);
                    // if (!rs) return res.status(404).send('No data exist!')
                    return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs });
                });
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.find = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.query._id) {
                    if (mongoose_1.Types.ObjectId.isValid(req.query._id)) {
                        types_1.MType.findById(req.query._id, (e, rs) => {
                            if (e)
                                return res.status(500).send(e);
                            return res.status(200).json(rs);
                        });
                    }
                    else {
                        return res.status(500).send('invalid');
                    }
                }
                else {
                    types_1.MType.findOne({ key: req.query.key }, (e, rs) => {
                        if (e)
                            return res.status(500).send(e);
                        return res.status(200).json(rs);
                    });
                }
            }
            catch (e) {
                console.log(e);
                return res.status(500).send('invalid');
            }
        });
        this.getKey = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                types_1.MType.distinct('key', req.body.conditions, (e, rs) => {
                    if (e)
                        return res.status(500).send(e);
                    if (req.query.filter)
                        rs = rs.filter(x => new RegExp(req.query.filter, 'i').test(x));
                    const rowsNumber = rs.length;
                    if (req.query.page && req.query.rowsPerPage)
                        rs = pagination_1.default.get(rs, req.query.page, req.query.rowsPerPage);
                    return res.status(200).json({ rowsNumber, data: rs });
                });
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.getMeta = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                types_1.MType.distinct(req.query.key ? 'meta.key' : 'meta.value', null, (e, rs) => {
                    if (e)
                        return res.status(500).send(e);
                    if (req.query.filter)
                        rs = rs.filter(x => new RegExp(req.query.filter, 'i').test(x));
                    const rowsNumber = rs.length;
                    if (req.query.page && req.query.rowsPerPage)
                        rs = pagination_1.default.get(rs, req.query.page, req.query.rowsPerPage);
                    return res.status(200).json({ rowsNumber, data: rs });
                });
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.insert = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // if (!req.body || Object.keys(req.body).length < 1 || req.body.key.length < 1 || req.body.name.length < 1) {
                //   return res.status(500).send('invalid')
                // }
                const x = yield types_1.MType.findOne({ key: req.body.key, code: req.body.code });
                if (x)
                    return res.status(501).send('exist');
                req.body.created = { at: new Date(), by: req.verify._id, ip: request_1.getIp(req) };
                const data = new types_1.MType(req.body);
                // data.validate()
                data.save((e, rs) => {
                    if (e)
                        return res.status(500).send(e);
                    // Push logs
                    logger_1.default.set({
                        userId: req.verify._id,
                        collName: 'types',
                        collId: rs._id,
                        method: 'insert',
                        ip: request_1.getIp(req),
                        userAgent: request_1.getUserAgent(req)
                    });
                    return res.status(201).json(rs);
                });
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // if (!req.params.id) return res.status(500).send('Incorrect Id!')
                if (!req.body || Object.keys(req.body).length < 1)
                    return res.status(500).send('invalid');
                const x = yield types_1.MType.findOne({ _id: { $nin: [req.body._id] }, key: req.body.key, code: req.body.code });
                if (x)
                    return res.status(501).send('exist');
                if (mongoose_1.Types.ObjectId.isValid(req.body._id)) {
                    types_1.MType.updateOne({ _id: req.body._id }, {
                        $set: {
                            key: req.body.key,
                            code: req.body.code,
                            name: req.body.name,
                            desc: req.body.desc,
                            meta: req.body.meta,
                            orders: req.body.orders,
                            flag: req.body.flag
                        }
                    }, (e, rs) => {
                        // { multi: true, new: true },
                        if (e)
                            return res.status(500).send(e);
                        // Push logs
                        logger_1.default.set({
                            userId: req.verify._id,
                            collName: 'types',
                            collId: rs._id,
                            method: 'update',
                            ip: request_1.getIp(req),
                            userAgent: request_1.getUserAgent(req)
                        });
                        return res.status(202).json(rs);
                    });
                }
                else {
                    return res.status(500).send('invalid');
                }
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.lock = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            try {
                const rs = { success: [], error: [] };
                try {
                    for (var _b = __asyncValues(req.body._id), _c; _c = yield _b.next(), !_c.done;) {
                        const _id = _c.value;
                        const x = yield types_1.MType.findById(_id);
                        if (x) {
                            const _x = yield types_1.MType.updateOne({ _id }, { $set: { flag: x.flag === 1 ? 0 : 1 } });
                            if (_x.nModified) {
                                rs.success.push(_id);
                                // Push logs
                                logger_1.default.set({
                                    userId: req.verify._id,
                                    collName: 'types',
                                    collId: _id,
                                    method: x.flag === 1 ? 'lock' : 'unlock',
                                    ip: request_1.getIp(req),
                                    userAgent: request_1.getUserAgent(req)
                                });
                            }
                            else
                                rs.error.push(_id);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return res.status(203).json(rs);
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (mongoose_1.Types.ObjectId.isValid(req.params._id)) {
                    types_1.MType.deleteOne({ _id: req.params._id }, (e) => {
                        if (e)
                            return res.status(500).send(e);
                        // Push logs
                        logger_1.default.set({
                            userId: req.verify._id,
                            collName: 'types',
                            collId: req.params._id,
                            method: 'delete',
                            ip: request_1.getIp(req),
                            userAgent: request_1.getUserAgent(req)
                        });
                        return res.status(204).json(true);
                    });
                }
                else {
                    return res.status(500).send('invalid');
                }
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
    }
}
exports.default = new TypesController();
//# sourceMappingURL=index.js.map