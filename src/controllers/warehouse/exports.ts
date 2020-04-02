import Logger from '../../services/logger';
import { startSession } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { getIp, getUserAgent } from '../../utils/request';
import { MProductExports } from '../../models/warehouse/exports';
import { MProductExportItems } from '../../models/warehouse/export-items';
import { MProduct } from '../../models/products';
import { NewGuid } from '../../utils/crypto';

class ProductExportsController {
  public path = '/product-exports';
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
        '_id code title quantity price price_discount price_export price_unit unit',
      );
      return res.status(200).json(rs);
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public exports = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(404).send('no_exist');
    if (!req.body.length) return res.status(202).json([]);
    const rs = { data: null as any, success: [] as any[], error: [] as any[] };
    const session = await startSession();
    session.startTransaction();
    try {
      // Import total
      const total = new MProductExports({
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
      // Push logs export
      Logger.set({
        userId: req.verify._id,
        collName: 'product_exports',
        collId: totalSave._id,
        method: 'insert',
        ip: getIp(req),
        userAgent: getUserAgent(req),
      });
      // Loop item
      for await (const e of req.body) {
        // Import item
        const items = new MProductExportItems({
          key: totalSave._id,
          product: e._id,
          price: parseInt(e.price),
          quantity: parseInt(e.quantity),
          amount: parseInt(e.amount),
        });
        // items.validate()
        const itemsSave = await items.save();
        if (!itemsSave) throw new Error('export item');
        MProduct.updateOne(
          { _id: e._id },
          {
            $set: { price_export: parseInt(e.price) },
            $inc: { quantity: -parseInt(e.quantity) },
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
export default new ProductExportsController();
