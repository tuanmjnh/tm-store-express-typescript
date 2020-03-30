const mongoose = require('mongoose'),
  Model = require('../models/logs'),
  request = require('../utils/request')
// console.log(ip.get(req), req.headers['user-agent'])

module.exports.push = async function(req, { user_id, collection, collection_id, method }) {
  const data = new Model({
    c: collection,
    cid: collection_id,
    func: method,
    at: new Date(),
    by: user_id, // mongoose.Schema.Types.ObjectId(by)
    ip: request.ip(req),
    com: req.headers['user-agent']
  })
  // data.validate()
  data.save((e, rs) => {
    if (e) return false
    return true
  })
}
