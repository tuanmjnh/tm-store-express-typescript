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
const routes_1 = require("../../models/routes");
// tmpRoutes = require('../../utils/tmp_routes'),
class RoutesController {
    constructor() {
        this.path = '/routes';
        this.generateRoutes = (routes, dependent = null) => {
            const rs = [];
            try {
                const children = routes.filter(x => x.dependent !== null);
                routes.forEach(e => {
                    if (e.dependent === dependent) {
                        const child = this.generateRoutes(children, e._id.toString());
                        if (child.length > 0)
                            e.children = child;
                        rs.push(e);
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
            return rs;
        };
        this.select = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let conditions;
                if (req.query.flag)
                    conditions = { $and: [{ flag: req.query.flag }] };
                if (req.query.filter) {
                    conditions.$and.push({
                        $or: [{ path: new RegExp(req.query.filter, 'i') }, { name: new RegExp(req.query.filter, 'i') }]
                    });
                }
                req.query.rowsNumber = yield routes_1.MRoute.where(conditions).countDocuments();
                const options = {
                    skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
                    limit: parseInt(req.query.rowsPerPage),
                    sort: { [req.query.sortBy || 'orders']: req.query.descending === 'true' ? -1 : 1 } // 1 ASC, -1 DESC
                };
                routes_1.MRoute.find(conditions, null, options, (e, rs) => {
                    if (e)
                        return res.status(500).send(e);
                    return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs });
                });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send('invalid');
            }
        });
        this.find = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.query._id) {
                    if (mongoose_1.Types.ObjectId.isValid(req.query._id)) {
                        routes_1.MRoute.findById(req.query._id, (e, rs) => {
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
                    routes_1.MRoute.findOne({ key: req.query.key }, (e, rs) => {
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
        this.getMeta = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                routes_1.MRoute.distinct(req.query.key ? 'meta.key' : 'meta.value', null, (e, rs) => {
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
                if (!req.body || Object.keys(req.body).length < 1 || req.body.path.length < 1 || req.body.name.length < 1) {
                    return res.status(500).send('invalid');
                }
                const x = yield routes_1.MRoute.findOne({ name: req.body.name });
                if (x)
                    return res.status(501).send('exist');
                req.body.created = { at: new Date(), by: req.verify._id, ip: request_1.getIp(req) };
                const data = new routes_1.MRoute(req.body);
                if (!req.body.dependent)
                    data.dependent = null;
                // data.validate()
                data.save((e, rs) => {
                    if (e)
                        return res.status(500).send(e);
                    // Push logs
                    logger_1.default.set({
                        userId: req.verify._id,
                        collName: 'routes',
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
        // private insertTemplateR = async routers => {
        //   const rs:any = [];
        //   for await (const e of routers) {
        //     const data = new Model(e);
        //     data.save().then(x => {
        //       if (x) rs.push(e);
        //       if (e.children) this.insertTemplateR(e.children);
        //     });
        //   }
        //   return rs;
        // };
        // public insertTemplate = async (req: Request, res: Response, next: NextFunction) => {
        //   try {
        //     if (!middleware.verify(req, res)) return;
        //     const rs = [];
        //     for await (const e of tmp_routes.data) {
        //       const x = await MRoute.findOne({ name: e.name });
        //       if (x) continue;
        //       const data = await new Model(e).save();
        //       if (data) rs.push(e);
        //     }
        //     return res.status(201).json(rs);
        //   } catch (e) {
        //     return res.status(500).send('invalid');
        //   }
        // };
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body || Object.keys(req.body).length < 1)
                    return res.status(500).send('invalid');
                if (mongoose_1.Types.ObjectId.isValid(req.body._id)) {
                    const x = yield routes_1.MRoute.findOne({ _id: { $nin: [req.body._id] }, name: req.body.name });
                    if (x)
                        return res.status(501).send('exist');
                    if (req.body.meta) {
                        req.body.meta.forEach(e => {
                            if (e.key === 'hidden')
                                e.value = e.value === 'true' ? true : false;
                        });
                    }
                    routes_1.MRoute.updateOne({ _id: req.body._id }, {
                        $set: {
                            path: req.body.path,
                            name: req.body.name,
                            component: req.body.component,
                            redirect: req.body.redirect,
                            // title: req.body.title,
                            // icon: req.body.icon,
                            orders: req.body.orders,
                            // hidden: req.body.hidden,
                            meta: req.body.meta,
                            flag: req.body.flag
                        }
                    }, (e, rs) => {
                        if (e)
                            return res.status(500).send(e);
                        // Push logs
                        // Push logs
                        logger_1.default.set({
                            userId: req.verify._id,
                            collName: 'routes',
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
        this.updateOrder = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // if (!req.params.id) return res.status(500).send('Incorrect Id!')
                if (!req.body || Object.keys(req.body).length < 1 || !req.body._id) {
                    return res.status(500).send('invalid');
                }
                if (!req.body.dependent)
                    req.body.dependent = null;
                if (mongoose_1.Types.ObjectId.isValid(req.body._id)) {
                    routes_1.MRoute.updateOne({ _id: req.body._id }, {
                        $set: {
                            dependent: req.body.dependent,
                            level: req.body.level,
                            orders: req.body.orders
                        }
                    }, (e, rs) => {
                        // { multi: true, new: true },
                        if (e)
                            return res.status(500).send(e);
                        // Push logs
                        // logs.push(req, { user_id: verify._id, collection: 'roles', collection_id: req.body._id, method: 'update' })
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
                        const x = yield routes_1.MRoute.findById(_id);
                        if (x) {
                            const _x = yield routes_1.MRoute.updateOne({ _id }, { $set: { flag: x.flag === 1 ? 0 : 1 } });
                            if (_x.nModified) {
                                rs.success.push(_id);
                                // Push logs
                                logger_1.default.set({
                                    userId: req.verify._id,
                                    collName: 'routes',
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
                    routes_1.MRoute.deleteOne({ _id: req.params._id }, (e) => {
                        if (e)
                            return res.status(500).send(e);
                        // Push logs
                        logger_1.default.set({
                            userId: req.verify._id,
                            collName: 'routes',
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
exports.default = new RoutesController();
//# sourceMappingURL=index.js.map