"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// dotenv
// dotenv.config({ path: `.env.${process.env.NODE_ENV.toString()}` });
// process.env.NODE_ENV = process.env.NODE_ENV || 'production';
if (process.env.NODE_ENV && process.env.NODE_ENV.toString().trim() === 'development') {
    dotenv_1.default.config({ path: '.env.development' });
}
else {
    dotenv_1.default.config({ path: '.env' });
}
// Root path
process.env.ROOT_PATH = __dirname;
process.env.PUBLIC_DIR = path_1.default.join(process.env.ROOT_PATH, process.env.PUBLIC_PATH); // `${process.env.ROOT_PATH}/${process.env.PUBLIC_PATH}`
process.env.STATIC_DIR = path_1.default.join(process.env.PUBLIC_DIR, process.env.STATIC_PATH);
process.env.UPLOAD_DIR = path_1.default.join(process.env.PUBLIC_DIR, process.env.UPLOAD_PATH);
process.env.PORT = process.env.PORT || 8001;
//# sourceMappingURL=index.js.map