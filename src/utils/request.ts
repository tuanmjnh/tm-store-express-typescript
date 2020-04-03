export const getIp = (request: any) => {
  // const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
  // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  // console.log(req.connection.remoteAddress)
  // console.log(req.connection.remotePort)
  // console.log(req.connection.localAddress)
  // console.log(req.connection.localPort)
  const _ip = request.ip;
  if (_ip === '::1') return '127.0.0.1';
  return _ip;
};

export const getHost = (request: any) => {
  if (request) return `${request.protocol}://${request.get('host')}`;
  return 'http://127.0.0.1/';
};

export const getHostUrl = (request: any) => {
  if (request) return `${request.protocol}://${request.get('host')}${request.originalUrl}`;
  return 'http://127.0.0.1/';
};

export const getUserAgent = (request: any) => {
  if (request) return request.headers['user-agent'];
  else return 'undefined';
};
