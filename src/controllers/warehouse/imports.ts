const mongoose = require('mongoose'),
  Model = require('../../models/warehouse/imports'),
  ModelItems = require('../../models/warehouse/import-items'),
  ModelProducts = require('../../models/products'),
  ModelCategories = require('../../models/categories'),
  middleware = require('../../services/middleware'),
  crypto = require('../../utils/crypto'),
  request = require('../../utils/request'),
  logs = require('../../db_apis/logs');

module.exports.select = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return;
    return res.status(200).json([]);
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.finds = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res);
    if (!verify) return;
    if (!req.body || req.body.length < 1) return res.status(404).send('no_exist');
    const rs = await ModelProducts.find(
      { code: { $in: req.body } },
      '_id code title quantity price price_discount price_import price_unit unit',
    );
    return res.status(200).json(rs);
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.imports = async function(req, res, next) {
  const verify = middleware.verify(req, res);
  if (!verify) return;
  if (!req.body) return res.status(404).send('no_exist');
  if (!req.body.length) return res.status(202).json([]);
  const rs = { data: null, success: [], error: [] };
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Import total
    const total = new Model({
      code: crypto.NewGuid(),
      product: req.body.length,
      quantity: req.body.sum('quantity'),
      price: req.body.sum('amount'),
      vat: Math.round(req.body.sum('amount') * 0.1, 0),
      created_at: new Date(),
      created_by: verify._id,
      created_ip: request.ip(req),
      flag: 1,
    });
    // total.validate()
    const totalSave = await total.save();
    if (!totalSave) return res.status(500).send('invalid');
    rs.data = totalSave;
    // Push logs import
    logs.push(req, {
      user_id: verify._id,
      collection: 'product_imports',
      collection_id: totalSave._id,
      method: 'insert',
    });
    // Loop item
    for await (const e of req.body) {
      // Insert new
      if (!e._id) {
        const category = await ModelCategories.findOne({ code: e.categories.toUpperCase() });
        if (!category) {
          rs.error.push(e);
          continue;
        }
        e.categories = category._id;
        //
        const product = new ModelProducts(e);
        // product.validate()
        const productSave = await product.save();
        if (!productSave) {
          rs.error.push(e);
          continue;
        }
        e._id = productSave._id;
        // Push logs product
        logs.push(req, { user_id: verify._id, collection: 'products', collection_id: e._id, method: 'insert' });
      }
      // Import item
      const items = new ModelItems({
        key: totalSave._id,
        product: e._id,
        price: parseInt(e.price),
        quantity: parseInt(e.quantity),
        amount: parseInt(e.amount),
      });
      // items.validate()
      const itemsSave = await items.save();
      if (!itemsSave) throw new Error('import item');
      ModelProducts.updateOne(
        { _id: e._id },
        {
          $set: { price_import: parseInt(e.price) },
          $inc: { quantity: parseInt(e.quantity) },
        },
      ).exec();
    }
    // commit
    await session.commitTransaction();
    session.endSession();
    return res.status(202).json(rs);
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send('invalid');
  }
};
