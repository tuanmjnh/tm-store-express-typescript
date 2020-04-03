import { Types } from 'mongoose';
import { INews, MNews } from '../../models/news';
import { Request, Response, NextFunction } from 'express';
import { getIp, getUserAgent } from '../../utils/request';
import Pagination from '../../utils/pagination';
import Logger from '../../services/logger';

class NewsController {
  public path = '/news';
  public select = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conditions = { $and: [{ flag: req.query.flag ? req.query.flag : 1 }] };
      if (req.query.filter) {
        // conditions.$and.push({
        //   $or: [
        //     { title: new RegExp(search.normalize(req.query.filter), 'i') },
        //     { code: new RegExp(search.normalize(req.query.filter), 'i') },
        //     { author: new RegExp(search.normalize(req.query.filter), 'i') }
        //   ]
        // })
        conditions.$and.push({ $text: { $search: req.query.filter } } as any);
      }
      if (req.query.categories) conditions.$and.push({ categories: req.query.categories } as any);
      if (!req.query.sortBy) req.query.sortBy = 'orders';
      req.query.rowsNumber = await MNews.where(conditions as any).countDocuments();
      const options = {
        skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
        limit: parseInt(req.query.rowsPerPage),
        sort: { [req.query.sortBy || 'level']: req.query.descending === 'true' ? -1 : 1 } // 1 ASC, -1 DESC
      };
      MNews.find(conditions, null, options, (e, rs) => {
        if (e) return res.status(500).send(e);
        // if (!rs) return res.status(404).send('No data exist!')
        return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs });
      });
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.query._id) {
        if (Types.ObjectId.isValid(req.query._id)) {
          MNews.findById(req.query._id, (e, rs) => {
            if (e) return res.status(500).send(e);
            return res.status(200).json(rs);
          });
        } else {
          return res.status(500).send('invalid');
        }
      } else {
        MNews.findOne({ key: req.query.key }, (e, rs) => {
          if (e) return res.status(500).send(e);
          return res.status(200).json(rs);
        });
      }
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public getAttr = async (req: Request, res: Response, next: NextFunction) => {
    try {
      MNews.distinct(req.query.key ? 'attr.key' : 'attr.value', null, (e, rs) => {
        if (e) return res.status(500).send(e);
        if (req.query.filter) rs = rs.filter(x => new RegExp(req.query.filter, 'i').test(x));
        const rowsNumber = rs.length;
        if (req.query.page && req.query.rowsPerPage) rs = Pagination.get(rs, req.query.page, req.query.rowsPerPage);
        return res.status(200).json({ rowsNumber, data: rs });
      });
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public insert = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!Types.ObjectId.isValid(req.body.categories)) return res.status(500).send('invalid');
      if (!req.body || Object.keys(req.body).length < 1 || !req.body.title) {
        return res.status(500).send('invalid');
      }
      req.body.created = { at: new Date(), by: req.verify._id, ip: getIp(req) };
      const data = new MNews(req.body);
      // data.validate()
      data.save((e, rs) => {
        if (e) return res.status(500).send(e);
        // Push logs
        Logger.set({
          userId: req.verify._id,
          collName: 'news',
          collId: rs._id,
          method: 'insert',
          ip: getIp(req),
          userAgent: getUserAgent(req)
        });
        return res.status(201).json(rs);
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send('invalid');
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // if (!req.params.id) return res.status(500).send('Incorrect Id!')
      if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid');
      if (Types.ObjectId.isValid(req.body._id)) {
        MNews.updateOne(
          { _id: req.body._id },
          {
            $set: {
              // type: req.body.type,
              categories: req.body.categories,
              title: req.body.title,
              code: req.body.code,
              desc: req.body.desc,
              content: req.body.content,
              url: req.body.url,
              images: req.body.images,
              author: req.body.author,
              date: req.body.date,
              pin: req.body.pin,
              tags: req.body.tags,
              attr: req.body.attr,
              meta: req.body.meta,
              attach: req.body.attach,
              start_at: req.body.start_at,
              end_at: req.body.end_at,
              orders: req.body.orders,
              flag: req.body.flag
            }
          },
          (e, rs) => {
            // { multi: true, new: true },
            if (e) return res.status(500).send(e);
            // Push logs
            Logger.set({
              userId: req.verify._id,
              collName: 'news',
              collId: rs._id,
              method: 'update',
              ip: getIp(req),
              userAgent: getUserAgent(req)
            });
            return res.status(202).json(rs);
          }
        );
      } else {
        return res.status(500).send('invalid');
      }
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public lock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { success: [] as string[], error: [] as string[] };
      for await (const _id of req.body._id) {
        const x = await MNews.findById(_id);
        if (x) {
          const _x = await MNews.updateOne({ _id }, { $set: { flag: x.flag === 1 ? 0 : 1 } });
          if (_x.nModified) {
            rs.success.push(_id);
            // Push logs
            Logger.set({
              userId: req.verify._id,
              collName: 'news',
              collId: _id,
              method: x.flag === 1 ? 'lock' : 'unlock',
              ip: getIp(req),
              userAgent: getUserAgent(req)
            });
          } else rs.error.push(_id);
        }
      }
      return res.status(203).json(rs);
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (Types.ObjectId.isValid(req.params._id)) {
        MNews.deleteOne({ _id: req.params._id }, (e: any) => {
          if (e) return res.status(500).send(e);
          // Push logs
          Logger.set({
            userId: req.verify._id,
            collName: 'news',
            collId: req.params._id,
            method: 'delete',
            ip: getIp(req),
            userAgent: getUserAgent(req)
          });
          return res.status(204).json(true);
        });
      } else {
        return res.status(500).send('invalid');
      }
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };
}
export default new NewsController();
