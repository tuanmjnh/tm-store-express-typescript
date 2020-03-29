const mongoose = require('mongoose'),
  Model = require('../../models/users'),
  validate = require('../../utils/validate'),
  middleware = require('../../services/middleware'),
  crypto = require('../../utils/crypto'),
  // moment = require('moment'),
  request = require('../../utils/request'),
  logs = require('../../db_apis/logs');

module.exports.select = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    let conditions = { $and: [{ enable: req.query.enable ? req.query.enable : true }] }
    if (req.query.filter) {
      conditions.$and.push({
        $or: [
          { email: new RegExp(req.query.filter, 'i') },
          { full_name: new RegExp(req.query.filter, 'i') },
          { person_number: new RegExp(req.query.filter, 'i') },
          { phone: new RegExp(req.query.filter, 'i') }
        ]
      })
    }
    if (!req.query.sortBy) req.query.sortBy = 'email'
    req.query.rowsNumber = await Model.where(conditions).countDocuments()
    const options = {
      skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
      limit: parseInt(req.query.rowsPerPage),
      sort: { [req.query.sortBy || 'email']: req.query.descending === 'true' ? -1 : 1 } // 1 ASC, -1 DESC
    }
    Model.find(conditions, null, options, function(e, rs) {
      if (e) return res.status(500).send(e)
      // if (!rs) return res.status(404).send('No data exist!')
      return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs })
    })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.find = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    if (!req.query._id) {
      if (mongoose.Types.ObjectId.isValid(req.query._id)) {
        Model.findById(req.query._id, (e, rs) => {
          if (e) return res.status(500).send(e)
          if (!rs) return res.status(404).send('no_exist')
          return res.status(200).json(rs)
        })
      } else {
        return res.status(500).send('invalid')
      }
    } else if (!req.query.email) {
      Model.findOne({ email: req.query.email }, (e, rs) => {
        if (e) return res.status(500).send(e)
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      })
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.insert = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    if (!req.body || Object.keys(req.body).length < 1 || !req.body.email) {
      return res.status(500).send('invalid')
    }
    const x = await Model.findOne({ email: req.body.email })
    if (x) return res.status(501).send('exist')
    const password = crypto.NewGuid().split('-')[0]
    req.body.salt = crypto.NewGuid('n')
    req.body.password = crypto.md5(password + req.body.salt)
    req.body.created = { at: new Date(), by: verify._id, ip: request.ip(req) }
    const data = new Model(req.body)
    // data.validate()
    data.save((e, rs) => {
      if (e) return res.status(500).send(e)
      rs.password = password
      // Push logs
      logs.push(req, { user_id: verify._id, collection: 'users', collection_id: rs._id, method: 'insert' })
      return res.status(201).json(rs)
    })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.create = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    if (!req.body && !Array.isArray(req.body)) return res.status(500).send('invalid')
    if (req.body.length < 1) return res.status(500).send('Empty data!')
    const data = []
    req.body.forEach(e => {
      data.push(new Model(e))
    })
    Model.create(data).then((rs) => {
      return res.status(201).json(rs)
    }).catch((e) => {
      return res.status(500).send(e)
    })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.insertOne = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    if (!req.body) return res.status(500).send('invalid')
    const data = new Model(req.body)
    data.validate()
    Model.collection.insertOne(data, (e, rs) => {
      if (e) return res.status(500).send(e)
      // Push logs
      logs.push(req, { user_id: verify._id, collection: 'users', collection_id: rs._id, method: 'insert' })
      return res.status(200).json(rs)
    })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.update = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    // if (!req.body._id) return res.status(500).send('invalid')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      Model.updateOne({ _id: req.body._id }, {
        $set: {
          full_name: req.body.full_name,
          phone: req.body.phone,
          person_number: req.body.person_number,
          region: req.body.region,
          avatar: req.body.avatar,
          note: req.body.note,
          date_birth: req.body.date_birth,
          gender: req.body.gender,
          address: req.body.address,
          roles: req.body.roles
        }
      }, (e, rs) => { // { multi: true, new: true },
        if (e) return res.status(500).send(e)
        // Push logs
        logs.push(req, { user_id: verify._id, collection: 'users', collection_id: req.body._id, method: 'update' })
        return res.status(202).json(rs)
      })
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.resetPassword = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      // Find user by id
      const x = await Model.findById(req.body._id)
      if (!x) return res.status(404).send('no_exist')
      // Generate password
      const password = crypto.NewGuid().split('-')[0]
      Model.updateOne({ _id: req.body._id }, { $set: { password: crypto.md5(password + x.salt) } }, (e, rs) => {
        if (e) return res.status(500).send(e)
        // Push logs
        logs.push(req, { user_id: verify._id, collection: 'users', collection_id: req.body._id, method: 'reset-password' })
        res.status(206).json({ password: password })
      })
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.changePassword = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    // Find user by id
    const user = await Model.findOne({ _id: verify._id })
    if (!user) return res.status(404).send('no_exist')
    // check password
    if (user.password !== crypto.md5(req.body.oldPassword + user.salt)) return res.status(505).json({ msg: 'wrong_password' })
    // set new password
    Model.updateOne({ _id: verify._id }, { $set: { password: crypto.md5(req.body.newPassword + user.salt) } }, (e, rs) => {
      if (e) return res.status(500).send(e)
      // Push logs
      logs.push(req, { user_id: verify._id, collection: 'users', collection_id: user._id, method: 'change-password' })
      res.status(202).json(true)
    })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.lock = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    let rs = { success: [], error: [] }
    for await (let _id of req.body._id) {
      // if (!validate.isBoolean(req.body.disabled)) {
      //   rs.error.push(id)
      //   continue
      // }
      const x = await Model.findById(_id)
      if (x) {
        var _x = await Model.updateOne({ _id: _id }, { $set: { enable: x.enable === true ? false : true } })
        if (_x.nModified) {
          rs.success.push(_id)
          // Push logs
          logs.push(req, { user_id: verify._id, collection: 'users', collection_id: _id, method: (x.enable === true ? 'lock' : 'unlock') })
        } else rs.error.push(_id)
      }
    }
    return res.status(203).json(rs)
    // if (!validate.isBoolean(req.body.disabled)) return res.status(500).send('invalid')
    // if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    //   Model.updateOne({ _id: req.params.id }, { $set: { disabled: req.body.disabled } }, (e, rs) => {
    //     if (e) return res.status(500).send(e)
    //     if (!rs) return res.status(404).send('no_exist')
    //     return res.status(203).json(rs)
    //   })
    // } else {
    //   return res.status(500).send('invalid')
    // }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.verified = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    if (!validate.isBoolean(req.body.verified)) return res.status(500).send('invalid')
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      Model.updateOne({ _id: req.body._id }, { $set: { verified: req.body.verified } }, (e, rs) => {
        if (e) return res.status(500).send(e)
        // Push logs
        logs.push(req, { user_id: verify._id, collection: 'users', collection_id: req.body._id, method: 'verified' })
        return res.status(205).json(rs)
      })
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.delete = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    if (mongoose.Types.ObjectId.isValid(req.params._id)) {
      Model.deleteOne({ _id: req.params._id }, (e, rs) => {
        if (e) return res.status(500).send(e)
        // Push logs
        logs.push(req, { user_id: verify._id, collection: 'users', collection_id: req.params._id, method: 'delete' })
        return res.status(204).json(rs)
      })
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
