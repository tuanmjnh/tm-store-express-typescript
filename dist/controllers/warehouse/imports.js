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
const imports_1 = require("../../models/warehouse/imports");
const import_items_1 = require("../../models/warehouse/import-items");
const categories_1 = require("../../models/categories");
const products_1 = require("../../models/products");
const crypto_1 = require("../../utils/crypto");
class ProductImportsController {
    constructor() {
        this.path = '/product-imports';
        this.select = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json([]);
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.finds = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body || req.body.length < 1)
                    return res.status(404).send('no_exist');
                const rs = yield products_1.MProduct.find({ code: { $in: req.body } }, '_id code title quantity price price_discount price_import price_unit unit');
                return res.status(200).json(rs);
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.imports = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            if (!req.body)
                return res.status(404).send('no_exist');
            if (!req.body.length)
                return res.status(202).json([]);
            const rs = { data: null, success: [], error: [] };
            const session = yield mongoose_1.startSession();
            session.startTransaction();
            try {
                // Import total
                const total = new imports_1.MProductImport({
                    code: crypto_1.NewGuid(),
                    product: req.body.length,
                    quantity: req.body.sum('quantity'),
                    price: req.body.sum('amount'),
                    vat: Math.round(req.body.sum('amount') * 0.1),
                    created_at: new Date(),
                    created_by: req.verify._id,
                    created_ip: request_1.getIp(req),
                    flag: 1,
                });
                // total.validate()
                const totalSave = yield total.save();
                if (!totalSave)
                    return res.status(500).send('invalid');
                rs.data = totalSave;
                // Push logs import
                logger_1.default.set({
                    userId: req.verify._id,
                    collName: 'product_imports',
                    collId: totalSave._id,
                    method: 'insert',
                    ip: request_1.getIp(req),
                    userAgent: request_1.getUserAgent(req),
                });
                try {
                    // Loop item
                    for (var _b = __asyncValues(req.body), _c; _c = yield _b.next(), !_c.done;) {
                        const e = _c.value;
                        // Insert new
                        if (!e._id) {
                            const category = yield categories_1.MCategory.findOne({ code: e.categories.toUpperCase() });
                            if (!category) {
                                rs.error.push(e);
                                continue;
                            }
                            e.categories = category._id;
                            //
                            const product = new products_1.MProduct(e);
                            // product.validate()
                            const productSave = yield product.save();
                            if (!productSave) {
                                rs.error.push(e);
                                continue;
                            }
                            e._id = productSave._id;
                            // Push logs product
                            logger_1.default.set({
                                userId: req.verify._id,
                                collName: 'products',
                                collId: e._id,
                                method: 'insert',
                                ip: request_1.getIp(req),
                                userAgent: request_1.getUserAgent(req),
                            });
                        }
                        // Import item
                        const items = new import_items_1.MProductImportItems({
                            key: totalSave._id,
                            product: e._id,
                            price: parseInt(e.price),
                            quantity: parseInt(e.quantity),
                            amount: parseInt(e.amount),
                        });
                        // items.validate()
                        const itemsSave = yield items.save();
                        if (!itemsSave)
                            throw new Error('import item');
                        products_1.MProduct.updateOne({ _id: e._id }, {
                            $set: { price_import: parseInt(e.price) },
                            $inc: { quantity: parseInt(e.quantity) },
                        }).exec();
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                // commit
                yield session.commitTransaction();
                session.endSession();
                return res.status(202).json(rs);
            }
            catch (e) {
                console.log(e);
                yield session.abortTransaction();
                session.endSession();
                return res.status(500).send('invalid');
            }
        });
    }
}
exports.default = new ProductImportsController();
//# sourceMappingURL=imports.js.map