import * as fs from 'fs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      verify: any;
    }
  }
}
export const sign = (params: any, secret?: string) => {
  // expires in 24 hours
  secret = secret || process.env.SECRET;
  return jwt.sign(params, secret, { expiresIn: '24h' });
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

export const verify = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      (req.path === process.env.BASE_URL && req.method.toUpperCase() === 'GET') ||
      (req.path === `${process.env.BASE_URL}api/auth` && req.method.toUpperCase() === 'POST')
    ) {
      next();
      return null;
    }
    const secret = process.env.SECRET;
    let token = (req.headers['x-access-token'] || req.headers.authorization) as string; // Express headers are auto converted to lowercase
    if (!token) {
      res.status(401).json({ msg: 'no_exist_token' });
      return;
    }
    // Remove Bearer from string
    if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
    req.verify = { ...jwt.verify(token, secret), ...{ token, secret } };
    next();
  } catch (e) {
    res.status(402).json({ msg: 'invalid_token' });
    return;
  }
};
export default verify;
