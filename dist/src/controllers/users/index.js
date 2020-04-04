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
const mongoose_1 = require("mongoose");
const request_1 = require("../../utils/request");
const users_1 = require("../../models/users");
const crypto_1 = require("../../utils/crypto");
const validate_1 = require("../../utils/validate");
class UsersController {
    constructor() {
        this.path = '/users';
        this.select = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const conditions = { $and: [{ enable: req.query.enable ? req.query.enable : true }] };
                if (req.query.filter) {
                    conditions.$and.push({
                        $or: [
                            { email: new RegExp(req.query.filter, 'i') },
                            { full_name: new RegExp(req.query.filter, 'i') },
                            { person_number: new RegExp(req.query.filter, 'i') },
                            { phone: new RegExp(req.query.filter, 'i') }
                        ]
                    });
                }
                if (!req.query.sortBy)
                    req.query.sortBy = 'email';
                req.query.rowsNumber = yield users_1.MUser.where(conditions).countDocuments();
                const options = {
                    skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
                    limit: parseInt(req.query.rowsPerPage),
                    sort: { [req.query.sortBy || 'email']: req.query.descending === 'true' ? -1 : 1 } // 1 ASC, -1 DESC
                };
                users_1.MUser.find(conditions, null, options, (e, rs) => {
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
                        users_1.MUser.findById(req.query._id, (e, rs) => {
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
                    users_1.MUser.findOne({ email: req.query.email }, (e, rs) => {
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
        this.insert = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body || Object.keys(req.body).length < 1 || !req.body.email) {
                    return res.status(500).send('invalid');
                }
                const x = yield users_1.MUser.findOne({ email: req.body.email });
                if (x)
                    return res.status(501).send('exist');
                const password = crypto_1.NewGuid().split('-')[0];
                req.body.salt = crypto_1.NewGuid('n');
                req.body.password = crypto_1.MD5Hash(password + req.body.salt);
                req.body.created = { at: new Date(), by: req.verify._id, ip: request_1.getIp(req) };
                const data = new users_1.MUser(req.body);
                // data.validate()
                data.save((e, rs) => {
                    if (e)
                        return res.status(500).send(e);
                    rs.password = password;
                    // Push logs
                    logger_1.default.set({
                        userId: req.verify._id,
                        collName: 'users',
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
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body && !Array.isArray(req.body))
                    return res.status(500).send('invalid');
                if (req.body.length < 1)
                    return res.status(500).send('Empty data!');
                const data = [];
                req.body.forEach(e => {
                    data.push(new users_1.MUser(e));
                });
                users_1.MUser.create(data)
                    .then(rs => {
                    return res.status(201).json(rs);
                })
                    .catch(e => {
                    return res.status(500).send(e);
                });
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.insertOne = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body)
                    return res.status(500).send('invalid');
                const data = new users_1.MUser(req.body);
                // data.validate();
                users_1.MUser.collection.insertOne(data, (e, rs) => {
                    if (e)
                        return res.status(500).send(e);
                    // Push logs
                    logger_1.default.set({
                        userId: req.verify._id,
                        collName: 'users',
                        collId: rs._id,
                        method: 'insert',
                        ip: request_1.getIp(req),
                        userAgent: request_1.getUserAgent(req)
                    });
                    return res.status(200).json(rs);
                });
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // if (!req.body._id) return res.status(500).send('invalid')
                if (!req.body || Object.keys(req.body).length < 1)
                    return res.status(500).send('invalid');
                if (mongoose_1.Types.ObjectId.isValid(req.body._id)) {
                    users_1.MUser.updateOne({ _id: req.body._id }, {
                        $set: {
                            full_name: req.body.full_name,
                            phone: req.body.phone,
                            person_number: req.body.person_number,
                            region: req.body.region,
                            avatar: req.body.avatar,
                            note: req.body.note,
                            date_birth: req.body.date_birth,
                            gender: req.body.gender,
                            address: req.body.address,
                            roles: req.body.roles
                        }
                    }, (e, rs) => {
                        // { multi: true, new: true },
                        if (e)
                            return res.status(500).send(e);
                        // Push logs
                        logger_1.default.set({
                            userId: req.verify._id,
                            collName: 'users',
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
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (mongoose_1.Types.ObjectId.isValid(req.body._id)) {
                    // Find user by id
                    const x = yield users_1.MUser.findById(req.body._id);
                    if (!x)
                        return res.status(404).send('no_exist');
                    // Generate password
                    const password = crypto_1.NewGuid().split('-')[0];
                    users_1.MUser.updateOne({ _id: req.body._id }, { $set: { password: crypto_1.MD5Hash(password + x.salt) } }, (e, rs) => {
                        if (e)
                            return res.status(500).send(e);
                        // Push logs
                        logger_1.default.set({
                            userId: req.verify._id,
                            collName: 'users',
                            collId: rs._id,
                            method: 'reset-password',
                            ip: request_1.getIp(req),
                            userAgent: request_1.getUserAgent(req)
                        });
                        res.status(206).json({ password });
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
        this.changePassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Find user by id
                const user = yield users_1.MUser.findOne({ _id: req.verify._id });
                if (!user)
                    return res.status(404).send('no_exist');
                // check password
                if (user.password !== crypto_1.MD5Hash(req.body.oldPassword + user.salt))
                    return res.status(505).json({ msg: 'wrong_password' });
                // set new password
                users_1.MUser.updateOne({ _id: req.verify._id }, { $set: { password: crypto_1.MD5Hash(req.body.newPassword + user.salt) } }, (e, rs) => {
                    if (e)
                        return res.status(500).send(e);
                    // Push logs
                    logger_1.default.set({
                        userId: req.verify._id,
                        collName: 'users',
                        collId: user._id,
                        method: 'change-password',
                        ip: request_1.getIp(req),
                        userAgent: request_1.getUserAgent(req)
                    });
                    res.status(202).json(true);
                });
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
                        // if (!validate.isBoolean(req.body.disabled)) {
                        //   rs.error.push(id)
                        //   continue
                        // }
                        const x = yield users_1.MUser.findById(_id);
                        if (x) {
                            const _x = yield users_1.MUser.updateOne({ _id }, { $set: { enable: x.enable === true ? false : true } });
                            if (_x.nModified) {
                                rs.success.push(_id);
                                // Push logs
                                logger_1.default.set({
                                    userId: req.verify._id,
                                    collName: 'users',
                                    collId: _id,
                                    method: x.enable ? 'lock' : 'unlock',
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
                // if (!validate.isBoolean(req.body.disabled)) return res.status(500).send('invalid')
                // if (Types.ObjectId.isValid(req.params.id)) {
                //   MUser.updateOne({ _id: req.params.id }, { $set: { disabled: req.body.disabled } }, (e, rs) => {
                //     if (e) return res.status(500).send(e)
                //     if (!rs) return res.status(404).send('no_exist')
                //     return res.status(203).json(rs)
                //   })
                // } else {
                //   return res.status(500).send('invalid')
                // }
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.verified = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!validate_1.isBoolean(req.body.verified))
                    return res.status(500).send('invalid');
                if (mongoose_1.Types.ObjectId.isValid(req.body._id)) {
                    users_1.MUser.updateOne({ _id: req.body._id }, { $set: { verified: req.body.verified } }, (e, rs) => {
                        if (e)
                            return res.status(500).send(e);
                        // Push logs
                        logger_1.default.set({
                            userId: req.verify._id,
                            collName: 'users',
                            collId: req.params._id,
                            method: 'verified',
                            ip: request_1.getIp(req),
                            userAgent: request_1.getUserAgent(req)
                        });
                        return res.status(205).json(rs);
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
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (mongoose_1.Types.ObjectId.isValid(req.params._id)) {
                    users_1.MUser.deleteOne({ _id: req.params._id }, (e) => {
                        if (e)
                            return res.status(500).send(e);
                        // Push logs
                        logger_1.default.set({
                            userId: req.verify._id,
                            collName: 'users',
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
exports.default = new UsersController();
//# sourceMappingURL=index.js.map