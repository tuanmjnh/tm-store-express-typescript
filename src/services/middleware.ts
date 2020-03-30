import jwt from 'jsonwebtoken';
import * as fs from 'fs';

module.exports.sign = (params: any, secret: string) => {
  // expires in 24 hours
  secret = secret || process.env.SECRET;
  return jwt.sign(params, secret, { expiresIn: '24h' });
};

module.exports.login = (req: any, res: any) => {
  try {
    let token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase
    if (!token) return res.status(401).json({ msg: 'no_exist_token' });
    // Remove Bearer from string
    if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
    const decoded = jwt.verify(token, process.env.SECRET);
    return { ...decoded, ...{ token, secret: process.env.SECRET } };
  } catch (err) {
    res.status(402).json({ msg: 'invalid_token' });
    return null;
  }
};

module.exports.verify = (req: any, res: any, secret: string) => {
  try {
    secret = secret || process.env.SECRET;
    let token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase
    if (!token) {
      res.status(401).json({ msg: 'no_exist_token' });
      return null;
    }
    // Remove Bearer from string
    if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
    // cert
    // var cert = fs.readFileSync('public.pem') // get public key
    // console.log(cert)
    // verify token
    // return jwt.verify(token, SECRET, (e, decoded) => {
    //   if (e) return res.status(402).json({ msg: 'invalid_token' })
    // })
    return { ...jwt.verify(token, secret), ...{ token, secret } };
  } catch (e) {
    res.status(402).json({ msg: 'invalid_token' });
    return null;
  }
};
