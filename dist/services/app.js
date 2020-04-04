"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const express_flash_1 = __importDefault(require("express-flash"));
const compression_1 = __importDefault(require("compression"));
// import lusca from 'lusca';
const router_1 = require("../router");
const mongoose = __importStar(require("./mongoose"));
const middleware_1 = __importDefault(require("./middleware"));
class App {
    constructor() {
        this.Routes = new router_1.Routes();
        // Connection MongoDB
        mongoose.initialize();
        // Create App
        this.app = express_1.default();
        // Config
        this.config();
    }
    config() {
        // trust proxy ip
        this.app.set('trust proxy', true);
        // static public
        // app.use(express.static(process.env.PUBLIC_PATH, { maxAge: 31557600000 }))
        // app.use('/public', express.static(path.join(__dirname, 'public')))
        this.app.use(`${process.env.BASE_URL}${process.env.PUBLIC_PATH}`, express_1.default.static(process.env.PUBLIC_DIR));
        this.app.use(`${process.env.BASE_URL}${process.env.STATIC_PATH}`, express_1.default.static(process.env.STATIC_DIR));
        this.app.use(`${process.env.BASE_URL}${process.env.UPLOAD_PATH}`, express_1.default.static(process.env.UPLOAD_DIR));
        // CORS middleware
        this.app.use(cors_1.default());
        this.app.options('*', cors_1.default());
        // support application/json type post data
        this.app.use(body_parser_1.default.json());
        // support application/x-www-form-urlencoded post data
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        // compression
        this.app.use(compression_1.default());
        // secret variable
        this.app.set('secret', process.env.SECRET);
        // flash
        this.app.use(express_flash_1.default());
        // session
        // this.app.use(express.session({ cookie: { maxAge: 60000 } }));
        this.app.use(express_session_1.default({
            resave: true,
            saveUninitialized: true,
            secret: process.env.SECRET
            // store: new MongoStore({
            //   url: mongoUrl,
            //   autoReconnect: true
            // })
        }));
        // lusca
        // this.app.use(
        // lusca({
        // csrf: true,
        // csp: {
        //   /* ... */
        // },
        //     xframe: 'SAMEORIGIN',
        //     p3p: 'ABCDEF',
        //     hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
        //     xssProtection: true,
        //     nosniff: true,
        //     referrerPolicy: 'same-origin',
        //   }),
        // );
        // Error Handler. Provides full stack - remove for production
        if (process.env.NODE_ENV !== 'production') {
            const errorHandler = require('errorHandler');
            this.app.use(errorHandler());
        }
        // middleware
        this.app.use(middleware_1.default);
        /* GET home page. */
        this.app.get(process.env.BASE_URL, (req, res, next) => {
            res.end(`TM-Store Express Server api. version: ${process.env.npm_package_version}`);
        });
        // Mount the router at /api so all its routes start with /api
        this.app.use(`${process.env.BASE_URL}api`, this.Routes.router);
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map