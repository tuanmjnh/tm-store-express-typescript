const mongoose = require('mongoose'),
  Model = require('../../models/products'),
  middleware = require('../../services/middleware'),
  pagination = require('../../utils/pagination'),
  request = require('../../utils/request'),
  logs = require('../../db_apis/logs')

module.exports.select = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    let conditions = { $and: [{ flag: req.query.flag ? req.query.flag : 1 }] }
    if (req.query.filter) {
      // conditions.$and.push({
      //   $or: [
      //     { title: new RegExp(search.normalize(req.query.filter), 'i') },
      //     { code: new RegExp(search.normalize(req.query.filter), 'i') },
      //     { origin: new RegExp(search.normalize(req.query.filter), 'i') }
      //   ]
      // })
      conditions.$and.push({ $text: { $search: req.query.filter } })
    }
    if (req.query.categories) conditions.$and.push({ categories: { $in: [req.query.categories] } })
    if (!req.query.sortBy) req.query.sortBy = 'orders'
    req.query.rowsNumber = await Model.where(conditions).countDocuments()
    const options = {
      skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
      limit: parseInt(req.query.rowsPerPage),
      sort: { [req.query.sortBy || 'orders']: req.query.descending === 'true' ? -1 : 1 } // 1 ASC, -1 DESC
    }
    Model.find(conditions, null, options, function(e, rs) {
      if (e) return res.status(500).send(e)
      // if (!rs) return res.status(404).send('No data exist!')
      return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs })
    })
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.find = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    if (req.query._id) {
      if (mongoose.Types.ObjectId.isValid(req.query._id)) {
        Model.findById(req.query._id, (e, rs) => {
          if (e) return res.status(500).send(e)
          if (!rs) return res.status(404).send('no_exist')
          return res.status(200).json(rs)
        })
      } else {
        return res.status(500).send('invalid')
      }
    } else if (req.query.code) {
      Model.findOne({ code: req.query.code }, (e, rs) => {
        if (e) return res.status(500).send(e)
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      })
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.exist = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    Model.findOne(req.query, (e, rs) => {
      if (e) return res.status(200).json(null)
      return res.status(200).json(rs)
    })
  } catch (e) {
    return res.status(200).json(null)
  }
}

module.exports.getAttr = async function(req, res, next) {
  try {
    Model.distinct(req.query.key ? 'attr.key' : 'attr.value', null, (e, rs) => {
      if (e) return res.status(500).send(e)
      if (req.query.filter) rs = rs.filter(x => new RegExp(req.query.filter, 'i').test(x))
      const rowsNumber = rs.length
      if (req.query.page && req.query.rowsPerPage) rs = pagination.get(rs, req.query.page, req.query.rowsPerPage)
      return res.status(200).json({ rowsNumber: rowsNumber, data: rs })
    })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.insert = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    if (!req.body || Object.keys(req.body).length < 1 || !req.body.title || !req.body.code || req.body.categories.length < 1) {
      return res.status(500).send('invalid')
    }
    const x = await Model.findOne({ code: req.body.code })
    if (x) return res.status(501).send('exist')
    req.body.created = { at: new Date(), by: verify._id, ip: request.ip(req) }
    const data = new Model(req.body)
    // data.validate()
    data.save((e, rs) => {
      if (e) return res.status(500).send(e)
      // Push logs
      logs.push(req, { user_id: verify._id, collection: 'products', collection_id: rs._id, method: 'insert' })
      return res.status(201).json(rs)
    })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.update = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    // if (!req.params.id) return res.status(500).send('Incorrect Id!')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      Model.updateOne({ _id: req.body._id }, {
        $set: {
          categories: req.body.categories,
          title: req.body.title,
          code: req.body.code,
          desc: req.body.desc,
          content: req.body.content,
          images: req.body.images,
          quantity: req.body.quantity,
          price: req.body.price,
          price_discount: req.body.price_discount,
          price_import: req.body.price_import,
          price_unit: req.body.price_unit,
          unit: req.body.unit,
          origin: req.body.origin,
          date: req.body.date,
          pin: req.body.pin,
          tags: req.body.tags,
          attr: req.body.attr,
          meta: req.body.meta,
          // start_at: req.body.start_at,
          // end_at: req.body.end_at,
          order: req.body.order,
          flag: req.body.flag
        }
      }, (e, rs) => { // { multi: true, new: true },
        if (e) return res.status(500).send(e)
        // Push logs
        logs.push(req, { user_id: verify._id, collection: 'products', collection_id: req.body._id, method: 'update' })
        return res.status(202).json(rs)
      })
    } else {
      return res.status(500).send('invalid')
    }
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
      const x = await Model.findById(_id)
      if (x) {
        var _x = await Model.updateOne({ _id: _id }, { $set: { flag: x.flag === 1 ? 0 : 1 } })
        if (_x.nModified) {
          rs.success.push(_id)
          // Push logs
          logs.push(req, { user_id: verify._id, collection: 'products', collection_id: _id, method: x.flag === 1 ? 'lock' : 'unlock' })
        } else rs.error.push(_id)
      }
    }
    return res.status(203).json(rs)
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
        logs.push(req, { user_id: verify._id, collection: 'products', collection_id: req.params._id, method: 'delete' })
        return res.status(204).json(rs)
      })
    } else {
      return res.status(500).send('invalid')
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}