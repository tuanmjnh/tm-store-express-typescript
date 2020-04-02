import Logger from '../../services/logger';
import { startSession } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { getIp, getUserAgent } from '../../utils/request';
import { MProductImport } from '../../models/warehouse/imports';
import { MProductImportItems } from '../../models/warehouse/import-items';
import { MCategory } from '../../models/categories';
import { MProduct } from '../../models/products';
import { NewGuid } from '../../utils/crypto';

class ProductImportsController {
  public path = '/product-imports';
  public select = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json([]);
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public finds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body || req.body.length < 1) return res.status(404).send('no_exist');
      const rs = await MProduct.find(
        { code: { $in: req.body } },
        '_id code title quantity price price_discount price_import price_unit unit',
      );
      return res.status(200).json(rs);
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public imports = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(404).send('no_exist');
    if (!req.body.length) return res.status(202).json([]);
    const rs = { data: null as any, success: [] as any[], error: [] as any[] };
    const session = await startSession();
    session.startTransaction();
    try {
      // Import total
      const total = new MProductImport({
        code: NewGuid(),
        product: req.body.length,
        quantity: req.body.sum('quantity'),
        price: req.body.sum('amount'),
        vat: Math.round(req.body.sum('amount') * 0.1),
        created_at: new Date(),
        created_by: req.verify._id,
        created_ip: getIp(req),
        flag: 1,
      });
      // total.validate()
      const totalSave = await total.save();
      if (!totalSave) return res.status(500).send('invalid');
      rs.data = totalSave;
      // Push logs import
      Logger.set({
        userId: req.verify._id,
        collName: 'product_imports',
        collId: totalSave._id,
        method: 'insert',
        ip: getIp(req),
        userAgent: getUserAgent(req),
      });
      // Loop item
      for await (const e of req.body) {
        // Insert new
        if (!e._id) {
          const category = await MCategory.findOne({ code: e.categories.toUpperCase() });
          if (!category) {
            rs.error.push(e);
            continue;
          }
          e.categories = category._id;
          //
          const product = new MProduct(e);
          // product.validate()
          const productSave = await product.save();
          if (!productSave) {
            rs.error.push(e);
            continue;
          }
          e._id = productSave._id;
          // Push logs product
          Logger.set({
            userId: req.verify._id,
            collName: 'products',
            collId: e._id,
            method: 'insert',
            ip: getIp(req),
            userAgent: getUserAgent(req),
          });
        }
        // Import item
        const items = new MProductImportItems({
          key: totalSave._id,
          product: e._id,
          price: parseInt(e.price),
          quantity: parseInt(e.quantity),
          amount: parseInt(e.amount),
        });
        // items.validate()
        const itemsSave = await items.save();
        if (!itemsSave) throw new Error('import item');
        MProduct.updateOne(
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
}
export default new ProductImportsController();
