import Logger from '../../services/logger';
import Pagination from '../../utils/pagination';
import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { getIp, getUserAgent } from '../../utils/request';
import { MRoute } from '../../models/routes';
// tmpRoutes = require('../../utils/tmp_routes'),

class RoutesController {
  public path = '/routes';
  public generateRoutes = (routes, dependent = null) => {
    const rs: any[] = [];
    try {
      const children = routes.filter(x => x.dependent !== null);
      routes.forEach(e => {
        if (e.dependent === dependent) {
          const child = this.generateRoutes(children, e._id.toString());
          if (child.length > 0) e.children = child;
          rs.push(e);
        }
      });
    } catch (e) {
      console.log(e);
    }
    return rs;
  };
  public select = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let conditions: any;
      if (req.query.flag) conditions = { $and: [{ flag: req.query.flag }] };
      if (req.query.filter) {
        conditions.$and.push({
          $or: [{ path: new RegExp(req.query.filter, 'i') }, { name: new RegExp(req.query.filter, 'i') }]
        } as any);
      }
      req.query.rowsNumber = await MRoute.where(conditions as any).countDocuments();
      const options = {
        skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
        limit: parseInt(req.query.rowsPerPage),
        sort: { [req.query.sortBy || 'orders']: req.query.descending === 'true' ? -1 : 1 } // 1 ASC, -1 DESC
      };
      MRoute.find(conditions, null, options, (e, rs) => {
        if (e) return res.status(500).send(e);
        return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs });
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send('invalid');
    }
  };

  public find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.query._id) {
        if (Types.ObjectId.isValid(req.query._id)) {
          MRoute.findById(req.query._id, (e, rs) => {
            if (e) return res.status(500).send(e);
            return res.status(200).json(rs);
          });
        } else {
          return res.status(500).send('invalid');
        }
      } else {
        MRoute.findOne({ key: req.query.key }, (e, rs) => {
          if (e) return res.status(500).send(e);
          return res.status(200).json(rs);
        });
      }
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public getMeta = async (req: Request, res: Response, next: NextFunction) => {
    try {
      MRoute.distinct(req.query.key ? 'meta.key' : 'meta.value', null, (e, rs) => {
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
      if (!req.body || Object.keys(req.body).length < 1 || req.body.path.length < 1 || req.body.name.length < 1) {
        return res.status(500).send('invalid');
      }
      const x = await MRoute.findOne({ name: req.body.name });
      if (x) return res.status(501).send('exist');
      req.body.created = { at: new Date(), by: req.verify._id, ip: getIp(req) };
      const data = new MRoute(req.body);
      if (!req.body.dependent) data.dependent = null;
      // data.validate()
      data.save((e, rs) => {
        if (e) return res.status(500).send(e);
        // Push logs
        Logger.set({
          userId: req.verify._id,
          collName: 'routes',
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

  // private insertTemplateR = async routers => {
  //   const rs:any = [];
  //   for await (const e of routers) {
  //     const data = new Model(e);
  //     data.save().then(x => {
  //       if (x) rs.push(e);
  //       if (e.children) this.insertTemplateR(e.children);
  //     });
  //   }
  //   return rs;
  // };

  // public insertTemplate = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     if (!middleware.verify(req, res)) return;
  //     const rs = [];
  //     for await (const e of tmp_routes.data) {
  //       const x = await MRoute.findOne({ name: e.name });
  //       if (x) continue;
  //       const data = await new Model(e).save();
  //       if (data) rs.push(e);
  //     }
  //     return res.status(201).json(rs);
  //   } catch (e) {
  //     return res.status(500).send('invalid');
  //   }
  // };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid');
      if (Types.ObjectId.isValid(req.body._id)) {
        const x = await MRoute.findOne({ _id: { $nin: [req.body._id] }, name: req.body.name });
        if (x) return res.status(501).send('exist');
        if (req.body.meta) {
          req.body.meta.forEach(e => {
            if (e.key === 'hidden') e.value = e.value === 'true' ? true : false;
          });
        }
        MRoute.updateOne(
          { _id: req.body._id },
          {
            $set: {
              path: req.body.path,
              name: req.body.name,
              component: req.body.component,
              redirect: req.body.redirect,
              // title: req.body.title,
              // icon: req.body.icon,
              orders: req.body.orders,
              // hidden: req.body.hidden,
              meta: req.body.meta,
              flag: req.body.flag
            }
          },
          (e, rs) => {
            if (e) return res.status(500).send(e);
            // Push logs
            // Push logs
            Logger.set({
              userId: req.verify._id,
              collName: 'routes',
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

  public updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // if (!req.params.id) return res.status(500).send('Incorrect Id!')
      if (!req.body || Object.keys(req.body).length < 1 || !req.body._id) {
        return res.status(500).send('invalid');
      }
      if (!req.body.dependent) req.body.dependent = null;
      if (Types.ObjectId.isValid(req.body._id)) {
        MRoute.updateOne(
          { _id: req.body._id },
          {
            $set: {
              dependent: req.body.dependent,
              level: req.body.level,
              orders: req.body.orders
            }
          },
          (e, rs) => {
            // { multi: true, new: true },
            if (e) return res.status(500).send(e);
            // Push logs
            // logs.push(req, { user_id: verify._id, collection: 'roles', collection_id: req.body._id, method: 'update' })
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
        const x = await MRoute.findById(_id);
        if (x) {
          const _x = await MRoute.updateOne({ _id }, { $set: { flag: x.flag === 1 ? 0 : 1 } });
          if (_x.nModified) {
            rs.success.push(_id);
            // Push logs
            Logger.set({
              userId: req.verify._id,
              collName: 'routes',
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
        MRoute.deleteOne({ _id: req.params._id }, (e: any) => {
          if (e) return res.status(500).send(e);
          // Push logs
          Logger.set({
            userId: req.verify._id,
            collName: 'routes',
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
export default new RoutesController();
