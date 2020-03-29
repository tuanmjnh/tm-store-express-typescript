const mongoose = require('mongoose'),
  Model = require('../../models/warehouse/exports'),
  ModelItems = require('../../models/warehouse/export-items'),
  ModelProducts = require('../../models/products'),
  ModelCategories = require('../../models/categories'),
  middleware = require('../../services/middleware'),
  crypto = require('../../utils/crypto'),
  request = require('../../utils/request'),
  logs = require('../../db_apis/logs')

module.exports.select = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    return res.status(200).json([])
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.finds = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    if (!req.body || req.body.length < 1) return res.status(404).send('no_exist')
    const rs = await ModelProducts.find({ code: { $in: req.body } }, '_id code title quantity price price_discount price_export price_unit unit')
    return res.status(200).json(rs)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.exports = async function(req, res, next) {
  const verify = middleware.verify(req, res)
  if (!verify) return
  if (!req.body) return res.status(404).send('no_exist')
  if (!req.body.length) return res.status(202).json([])
  const rs = { data: null, success: [], error: [] }
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    // Import total
    const total = new Model({
      code: crypto.NewGuid(),
      total_product: req.body.length,
      total_price: req.body.sum('price_export'),
      total_quantity: req.body.sum('quantity_export'),
      created_at: new Date(),
      created_by: verify._id,
      created_ip: request.ip(req),
      flag: 1
    })
    // total.validate()
    const totalSave = await total.save()
    if (!totalSave) return res.status(500).send('invalid')
    rs.data = totalSave
    // Push logs export
    logs.push(req, { user_id: verify._id, collection: 'product_exports', collection_id: totalSave._id, method: 'insert' })
    // Loop item
    for await (const e of req.body) {
      // Import item
      const items = new ModelItems({
        export: totalSave._id,
        product: e._id,
        price: parseInt(e.price_export),
        quantity: parseInt(e.quantity_export)
      })
      // items.validate()
      const itemsSave = await items.save()
      if (!itemsSave) throw new Error('export item')
      ModelProducts.updateOne({ _id: e._id }, {
        $set: { price_export: parseInt(e.price_export) },
        $inc: { quantity: -parseInt(e.quantity_export) }
      }).exec()
    }
    // commit
    await session.commitTransaction();
    session.endSession();
    return res.status(202).json(rs)
  } catch (e) {
    console.log(e)
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send('invalid')
  }
}
