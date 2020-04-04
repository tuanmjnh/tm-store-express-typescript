"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.sign = (params, secret) => {
    // expires in 24 hours
    secret = secret || process.env.SECRET;
    return jsonwebtoken_1.default.sign(params, secret, { expiresIn: '24h' });
};
// export const login = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     let token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase
//     if (!token) return res.status(401).json({ msg: 'no_exist_token' });
//     // Remove Bearer from string
//     if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
//     const decoded = jwt.verify(token, process.env.SECRET);
//     return { ...decoded, ...{ token, secret: process.env.SECRET } };
//   } catch (err) {
//     res.status(402).json({ msg: 'invalid_token' });
//     return null;
//   }
// };
// export const verify = (req: Request, res: Response, secret?: string) => {
//   try {
//     secret = secret || process.env.SECRET || '';
//     let token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase
//     if (!token) {
//       res.status(401).json({ msg: 'no_exist_token' });
//       return null;
//     }
//     // Remove Bearer from string
//     if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
//     // cert
//     // var cert = fs.readFileSync('public.pem') // get public key
//     // console.log(cert)
//     // verify token
//     // return jwt.verify(token, SECRET, (e, decoded) => {
//     //   if (e) return res.status(402).json({ msg: 'invalid_token' })
//     // })
//     return { ...jwt.verify(token, secret), ...{ token, secret } };
//   } catch (e) {
//     res.status(402).json({ msg: 'invalid_token' });
//     return null;
//   }
// };
// function loggerMiddleware(request: express.Request, response: express.Response, next) {
//   console.log(`${request.method} ${request.path}`);
//   next();
// }
// const app = express();
// app.use(loggerMiddleware);
exports.verify = (req, res, next) => {
    try {
        const baseUrl = process.env.BASE_URL.trimChars('/'); // .replace(/\/$/, '');
        const reqPath = req.path.trimChars('/');
        if ((reqPath === baseUrl && req.method.toUpperCase() === 'GET') ||
            (reqPath === `${baseUrl}api/auth` && req.method.toUpperCase() === 'POST')) {
            next();
            return null;
        }
        const secret = process.env.SECRET;
        let token = (req.headers['x-access-token'] || req.headers.authorization); // Express headers are auto converted to lowercase
        if (!token) {
            res.status(401).json({ msg: 'no_exist_token' });
            return;
        }
        // Remove Bearer from string
        if (token.startsWith('Bearer '))
            token = token.slice(7, token.length);
        req.verify = Object.assign(Object.assign({}, jsonwebtoken_1.default.verify(token, secret)), { token, secret });
        next();
    }
    catch (e) {
        res.status(402).json({ msg: 'invalid_token' });
        return;
    }
};
exports.default = exports.verify;
//# sourceMappingURL=middleware.js.map