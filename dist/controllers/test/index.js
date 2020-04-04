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
Object.defineProperty(exports, "__esModule", { value: true });
class TestController {
    constructor() {
        this.path = '/test';
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ data: true, method: 'get' });
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.post = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ data: true, method: 'post' });
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.put = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ data: true, method: 'put' });
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.patch = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ data: true, method: 'patch' });
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ data: true, method: 'delete' });
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
    }
}
exports.default = new TestController();
//# sourceMappingURL=index.js.map