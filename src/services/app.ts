import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import flash from 'express-flash';
import compression from 'compression';
import lusca from 'lusca';
import { Routes } from '../router';
import * as mongoose from './mongoose';
import middleware from './middleware';
class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();
  constructor() {
    // Connection MongoDB
    mongoose.initialize();
    // Create App
    this.app = express();
    // Config
    this.config();
    // Routes
    this.routePrv.routes(this.app);
  }
  private config(): void {
    // trust proxy ip
    this.app.set('trust proxy', true);
    // static public
    // app.use(express.static(process.env.PUBLIC_PATH, { maxAge: 31557600000 }))
    // app.use('/public', express.static(path.join(__dirname, 'public')))
    this.app.use(`${process.env.BASE_URL}${process.env.PUBLIC_PATH}`, express.static(process.env.PUBLIC_DIR));
    this.app.use(`${process.env.BASE_URL}${process.env.STATIC_PATH}`, express.static(process.env.STATIC_DIR));
    this.app.use(`${process.env.BASE_URL}${process.env.UPLOAD_PATH}`, express.static(process.env.UPLOAD_DIR));
    // CORS middleware
    this.app.use(cors());
    this.app.options('*', cors());
    // support application/json type post data
    this.app.use(bodyParser.json());
    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
    // compression
    this.app.use(compression());
    // secret variable
    this.app.set('secret', process.env.SECRET);
    // flash
    this.app.use(flash());
    // session
    // this.app.use(express.session({ cookie: { maxAge: 60000 } }));
    this.app.use(
      session({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SECRET,
        // store: new MongoStore({
        //   url: mongoUrl,
        //   autoReconnect: true
        // })
      }),
    );
    // lusca
    this.app.use(
      lusca({
        csrf: true,
        // csp: {
        //   /* ... */
        // },
        xframe: 'SAMEORIGIN',
        p3p: 'ABCDEF',
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
        xssProtection: true,
        nosniff: true,
        referrerPolicy: 'same-origin',
      }),
    );
    // Error Handler. Provides full stack - remove for production
    if (process.env.NODE_ENV !== 'production') {
      const errorHandler = require('errorHandler');
      this.app.use(errorHandler());
    }
    // middleware
    this.app.use(middleware);
    /* GET home page. */
    this.app.get(process.env.BASE_URL, (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.end('TM-Store Express Server api');
    });
    // Mount the router at /api so all its routes start with /api
    // this.app.use(`${process.env.BASE_URL}api`, router);
  }
}

export default new App().app;
