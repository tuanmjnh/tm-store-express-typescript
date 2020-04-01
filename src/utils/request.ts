export const getIp = (req: any) => {
  // const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
  // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  // console.log(req.connection.remoteAddress)
  // console.log(req.connection.remotePort)
  // console.log(req.connection.localAddress)
  // console.log(req.connection.localPort)
  const _ip = req.ip;
  if (_ip === '::1') return '127.0.0.1';
  return _ip;
};

export const getHost = (req: any) => {
  if (req) return `${req.protocol}://${req.get('host')}`;
  return 'http://127.0.0.1/';
};

export const getHostUrl = (req: any) => {
  if (req) return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  return 'http://127.0.0.1/';
};

export const getUserAgent = (req: any) => {
  if (req) return req.headers['user-agent'];
  else return 'undefined';
};
