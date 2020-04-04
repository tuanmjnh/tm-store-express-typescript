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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("../../utils/crypto");
const users_1 = require("../../models/users");
const roles_1 = require("../../models/roles");
const routes_1 = require("../../models/routes");
const middleware = __importStar(require("../../services/middleware"));
class AuthController {
    constructor() {
        this.path = '/auth';
        // public router = Router();
        // constructor() {
        //   this.initRoutes();
        // }
        // private initRoutes() {
        //   this.router
        //     .route(this.path)
        //     .get(this.authToken)
        //     .post(this.authLogin);
        // }
        this.generateRoutesChildren = (routes, rolesRoutes) => {
            const rs = [];
            routes.forEach((e) => {
                if (rolesRoutes.indexOf(e.name) >= 1)
                    rs.push(e);
                else {
                    if (e.children) {
                        const tmp = this.generateRoutes(e.children, rolesRoutes);
                        if (tmp.length > 0) {
                            e.children = tmp;
                            rs.push(e);
                        }
                    }
                }
            });
            return rs;
        };
        this.generateRoutes = (routes, rolesRoutes, dependent) => {
            const rs = [];
            try {
                const children = routes.filter(x => x.dependent !== null);
                routes.forEach(e => {
                    const _dependent = e.dependent ? e.dependent.toString() : null;
                    if (rolesRoutes.indexOf(e.name) >= 0 && _dependent === dependent) {
                        const child = this.generateRoutes(children, rolesRoutes, e._id.toString());
                        if (child.length > 0)
                            e.children = child;
                        rs.push(e);
                    }
                    // if (rolesRoutes.indexOf(e.name) >= 0 && e.parents !== null) {
                    //   const x = routes.find(x => x._id.toString() === e.parents)
                    //   if (x) {
                    //     helpers.pushIfNotExist(x.children, e)
                    //     helpers.pushIfNotExist(rs, x)
                    //   }
                    // }
                });
            }
            catch (e) {
                console.log(e);
            }
            return rs;
        };
        this.getAuthRoutes = (authRoles) => __awaiter(this, void 0, void 0, function* () {
            // Roles
            const roles = yield roles_1.MRole.find({ _id: { $in: authRoles } }).sort({ level: 1 });
            const authRoutes = [];
            roles.forEach((e) => {
                // helpers.pushIfNotExist(authRoutes, e.routes);
                authRoutes.pushIfNotExist(e.routes);
            });
            // Routes
            const routes = yield routes_1.MRoute.find({ flag: 1 }).sort({ dependent: 1, orders: 1 });
            // console.log(routes)
            return this.generateRoutes(routes, authRoutes);
        });
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const rs = yield users_1.MUser.findOne({ _id: req.verify._id });
                if (!rs)
                    return res.status(402).json({ msg: 'token_invalid' });
                // Routes
                const routes = yield this.getAuthRoutes(rs.roles);
                return res.status(200).json({ user: rs, routes });
                // return res.status(200).json({ data: req.verify._id as any });
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.post = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // check req data
                if (!req.body.username || !req.body.password)
                    return res.status(404).json({ msg: 'no_exist' });
                // throw new Error('wrong')
                const rs = yield users_1.MUser.findOne({ email: req.body.username });
                // console.log(rs)
                // not exist username
                if (!rs)
                    return res.status(502).json({ msg: 'no_exist' });
                // check password
                if (rs.password !== crypto_1.MD5Hash(req.body.password + rs.salt))
                    return res.status(503).json({ msg: 'no_exist' });
                // check lock
                if (!rs.enable)
                    return res.status(504).json({ msg: 'locked' });
                // Routes
                const routes = yield this.getAuthRoutes(rs.roles);
                // Update last login
                yield users_1.MUser.updateOne({ _id: rs._id }, {
                    $set: {
                        last_login: new Date()
                    }
                });
                // Token
                const token = middleware.sign({ _id: rs._id });
                if (rs)
                    return res.status(200).json({ token, user: rs, routes });
                else
                    return res.status(401).json({ msg: 'wrong' });
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
    }
}
exports.default = new AuthController();
//# sourceMappingURL=index.js.map