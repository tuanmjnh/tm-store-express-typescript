import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import flash from 'express-flash';
import compression from 'compression';
// import lusca from 'lusca';
// import errorHandler from 'errorHandler';
import Router from '../router';
import * as mongoose from './mongoose';

// console.log(process.env.ROOT_PATH)
// if (process.env.NODE_ENV.toString() === 'development') dotenv.config({ path: '.env.development' })
// else dotenv.config({ path: '.env' })

// if (process.env.NODE_ENV !== 'production') {
//   process.env.BASE_URL = '/'
// }
// Connection MongoDB
mongoose.initialize();
// app express
const app = express();
// trust proxy ip
app.set('trust proxy', true);
// static public
// app.use(express.static(process.env.PUBLIC_PATH, { maxAge: 31557600000 }))
// app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(`${process.env.BASE_URL}${process.env.PUBLIC_PATH}`, express.static(process.env.PUBLIC_DIR));
app.use(`${process.env.BASE_URL}${process.env.STATIC_PATH}`, express.static(process.env.STATIC_DIR));
app.use(`${process.env.BASE_URL}${process.env.UPLOAD_PATH}`, express.static(process.env.UPLOAD_DIR));
// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// CORS middleware
app.use(cors());
app.options('*', cors());
// compression
app.use(compression());
// secret variable
app.set('secret', process.env.SECRET);
// session
// app.use(express.session({ cookie: { maxAge: 60000 } }))
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET
    // store: new MongoStore({
    //   url: mongoUrl,
    //   autoReconnect: true
    // })
  })
);
// flash
app.use(flash());
// lusca
// app.use(lusca.xframe('SAMEORIGIN'));
// app.use(lusca.xssProtection(true));
// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// });
// Error Handler. Provides full stack - remove for production
// if (process.env.NODE_ENV !== 'production') {
//   app.use(errorHandler());
// }

const port = process.env.PORT || 8001;

/**
 * Primary app routes.
 */
/* GET home page. */
app.get(process.env.BASE_URL, (req: any, res: any, next: any) => {
  // res.render('index', { title: 'Express' })
  // var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.end('TM-Store Express Server api', { title: 'Express' });
});
// Mount the router at /api so all its routes start with /api
app.use(`${process.env.BASE_URL}api`, new Router().router);

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
