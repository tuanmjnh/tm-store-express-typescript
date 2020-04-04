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
const logger_1 = require("../models/logger");
// console.log(ip.get(req), req.headers['user-agent'])
class Logger {
    constructor() {
        this.set = (logger) => __awaiter(this, void 0, void 0, function* () {
            // const data = new Model({
            //   c: logger.collection_name,
            //   cid: logger.collection_id,
            //   method: logger.method,
            //   at: new Date(),
            //   by: logger.user_id, // mongoose.Schema.Types.ObjectId(by)
            //   ip: logger.ip,
            //   com: req.headers['user-agent'],
            // });
            const data = new logger_1.MLogger(logger);
            // data.validate()
            data.save((e, rs) => {
                if (e)
                    return false;
                return true;
            });
        });
    }
}
exports.default = new Logger();
//# sourceMappingURL=logger.js.map