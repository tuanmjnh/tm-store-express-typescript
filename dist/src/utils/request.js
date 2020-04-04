"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIp = (request) => {
    // const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
    // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    // console.log(req.connection.remoteAddress)
    // console.log(req.connection.remotePort)
    // console.log(req.connection.localAddress)
    // console.log(req.connection.localPort)
    const _ip = request.ip;
    if (_ip === '::1')
        return '127.0.0.1';
    return _ip;
};
exports.getHost = (request) => {
    if (request)
        return `${request.protocol}://${request.get('host')}`;
    return 'http://127.0.0.1/';
};
exports.getHostUrl = (request) => {
    if (request)
        return `${request.protocol}://${request.get('host')}${request.originalUrl}`;
    return 'http://127.0.0.1/';
};
exports.getUserAgent = (request) => {
    if (request)
        return request.headers['user-agent'];
    else
        return 'undefined';
};
//# sourceMappingURL=request.js.map