module.exports.ip = function(req) {
  // const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
  // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  // console.log(req.connection.remoteAddress)
  // console.log(req.connection.remotePort)
  // console.log(req.connection.localAddress)
  // console.log(req.connection.localPort)
  const ip = req.ip
  if (ip === '::1') return '127.0.0.1'
  return ip
}

module.exports.host = function(req) {
  if (req) return `${req.protocol}://${req.get('host')}`
  return 'http://127.0.0.1/'
}

module.exports.hostUrl = function(req) {
  if (req) return `${req.protocol}://${req.get('host')}${req.originalUrl}`
  return 'http://127.0.0.1/'
}
