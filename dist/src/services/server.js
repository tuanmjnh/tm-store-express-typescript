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
const errorHandler_1 = __importDefault(require("errorHandler"));
const router_1 = __importDefault(require("../router"));
const mongoose = __importStar(require("./mongoose"));
// console.log(process.env.ROOT_PATH)
// if (process.env.NODE_ENV.toString() === 'development') dotenv.config({ path: '.env.development' })
// else dotenv.config({ path: '.env' })
// if (process.env.NODE_ENV !== 'production') {
//   process.env.BASE_URL = '/'
// }
// Connection MongoDB
mongoose.initialize();
// app express
const app = express_1.default();
// trust proxy ip
app.set('trust proxy', true);
// static public
// app.use(express.static(process.env.PUBLIC_PATH, { maxAge: 31557600000 }))
// app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(`${process.env.BASE_URL}${process.env.PUBLIC_PATH}`, express_1.default.static(process.env.PUBLIC_DIR));
app.use(`${process.env.BASE_URL}${process.env.STATIC_PATH}`, express_1.default.static(process.env.STATIC_DIR));
app.use(`${process.env.BASE_URL}${process.env.UPLOAD_PATH}`, express_1.default.static(process.env.UPLOAD_DIR));
// bodyParser
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// CORS middleware
app.use(cors_1.default());
app.options('*', cors_1.default());
// compression
app.use(compression_1.default());
// secret variable
app.set('secret', process.env.SECRET);
// session
// app.use(express.session({ cookie: { maxAge: 60000 } }))
app.use(express_session_1.default({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET
    // store: new MongoStore({
    //   url: mongoUrl,
    //   autoReconnect: true
    // })
}));
// flash
app.use(express_flash_1.default());
// lusca
// app.use(lusca.xframe('SAMEORIGIN'));
// app.use(lusca.xssProtection(true));
// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// });
// Error Handler. Provides full stack - remove for production
if (process.env.NODE_ENV !== 'production') {
    app.use(errorHandler_1.default());
}
const port = process.env.PORT || 8001;
/**
 * Primary app routes.
 */
/* GET home page. */
app.get(process.env.BASE_URL, (req, res, next) => {
    // res.render('index', { title: 'Express' })
    // var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.end('TM-Store Express Server api', { title: 'Express' });
});
// Mount the router at /api so all its routes start with /api
app.use(`${process.env.BASE_URL}api`, new router_1.default().router);
// listen
app
    .listen(port) // , '192.168.1.10' // '127.0.0.1'
    .on('listening', () => {
    // process.env.HOST = `http://${server.address().address}:${port}`
    console.log(`Web server listening on: ${process.env.PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV}`);
})
    .on('error', err => {
    console.log(err);
});
//# sourceMappingURL=server.js.map