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
const mongoose_1 = require("mongoose");
const news_1 = require("../../models/news");
const request_1 = require("../../utils/request");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const logger_1 = __importDefault(require("../../services/logger"));
class NewsController {
    constructor() {
        this.path = '/news';
        this.select = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const conditions = { $and: [{ flag: req.query.flag ? req.query.flag : 1 }] };
                if (req.query.filter) {
                    // conditions.$and.push({
                    //   $or: [
                    //     { title: new RegExp(search.normalize(req.query.filter), 'i') },
                    //     { code: new RegExp(search.normalize(req.query.filter), 'i') },
                    //     { author: new RegExp(search.normalize(req.query.filter), 'i') }
                    //   ]
                    // })
                    conditions.$and.push({ $text: { $search: req.query.filter } });
                }
                if (req.query.categories)
                    conditions.$and.push({ categories: req.query.categories });
                if (!req.query.sortBy)
                    req.query.sortBy = 'orders';
                req.query.rowsNumber = yield news_1.MNews.where(conditions).countDocuments();
                const options = {
                    skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
                    limit: parseInt(req.query.rowsPerPage),
                    sort: { [req.query.sortBy || 'level']: req.query.descending === 'true' ? -1 : 1 } // 1 ASC, -1 DESC
                };
                news_1.MNews.find(conditions, null, options, (e, rs) => {
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
                        news_1.MNews.findById(req.query._id, (e, rs) => {
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
                    news_1.MNews.findOne({ key: req.query.key }, (e, rs) => {
                        if (e)
                            return res.status(500).send(e);
                        return res.status(200).json(rs);
                    });
                }
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.getAttr = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                news_1.MNews.distinct(req.query.key ? 'attr.key' : 'attr.value', null, (e, rs) => {
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
                if (!mongoose_1.Types.ObjectId.isValid(req.body.categories))
                    return res.status(500).send('invalid');
                if (!req.body || Object.keys(req.body).length < 1 || !req.body.title) {
                    return res.status(500).send('invalid');
                }
                req.body.created = { at: new Date(), by: req.verify._id, ip: request_1.getIp(req) };
                const data = new news_1.MNews(req.body);
                // data.validate()
                data.save((e, rs) => {
                    if (e)
                        return res.status(500).send(e);
                    // Push logs
                    logger_1.default.set({
                        userId: req.verify._id,
                        collName: 'news',
                        collId: rs._id,
                        method: 'insert',
                        ip: request_1.getIp(req),
                        userAgent: request_1.getUserAgent(req)
                    });
                    return res.status(201).json(rs);
                });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send('invalid');
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // if (!req.params.id) return res.status(500).send('Incorrect Id!')
                if (!req.body || Object.keys(req.body).length < 1)
                    return res.status(500).send('invalid');
                if (mongoose_1.Types.ObjectId.isValid(req.body._id)) {
                    news_1.MNews.updateOne({ _id: req.body._id }, {
                        $set: {
                            // type: req.body.type,
                            categories: req.body.categories,
                            title: req.body.title,
                            code: req.body.code,
                            desc: req.body.desc,
                            content: req.body.content,
                            url: req.body.url,
                            images: req.body.images,
                            author: req.body.author,
                            date: req.body.date,
                            pin: req.body.pin,
                            tags: req.body.tags,
                            attr: req.body.attr,
                            meta: req.body.meta,
                            attach: req.body.attach,
                            start_at: req.body.start_at,
                            end_at: req.body.end_at,
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
                            collName: 'news',
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
                        const x = yield news_1.MNews.findById(_id);
                        if (x) {
                            const _x = yield news_1.MNews.updateOne({ _id }, { $set: { flag: x.flag === 1 ? 0 : 1 } });
                            if (_x.nModified) {
                                rs.success.push(_id);
                                // Push logs
                                logger_1.default.set({
                                    userId: req.verify._id,
                                    collName: 'news',
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
                    news_1.MNews.deleteOne({ _id: req.params._id }, (e) => {
                        if (e)
                            return res.status(500).send(e);
                        // Push logs
                        logger_1.default.set({
                            userId: req.verify._id,
                            collName: 'news',
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
exports.default = new NewsController();
//# sourceMappingURL=index.js.map