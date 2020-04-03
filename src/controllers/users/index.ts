import Logger from '../../services/logger';
import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { getIp, getUserAgent } from '../../utils/request';
import { MUser } from '../../models/users';
import { MD5Hash, NewGuid } from '../../utils/crypto';
import { isBoolean } from '../../utils/validate';

class UsersController {
  public path = '/users';
  public select = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conditions = { $and: [{ enable: req.query.enable ? req.query.enable : true }] };
      if (req.query.filter) {
        conditions.$and.push({
          $or: [
            { email: new RegExp(req.query.filter, 'i') },
            { full_name: new RegExp(req.query.filter, 'i') },
            { person_number: new RegExp(req.query.filter, 'i') },
            { phone: new RegExp(req.query.filter, 'i') }
          ]
        } as any);
      }
      if (!req.query.sortBy) req.query.sortBy = 'email';
      req.query.rowsNumber = await MUser.where(conditions as any).countDocuments();
      const options = {
        skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
        limit: parseInt(req.query.rowsPerPage),
        sort: { [req.query.sortBy || 'email']: req.query.descending === 'true' ? -1 : 1 } // 1 ASC, -1 DESC
      };
      MUser.find(conditions, null, options, (e: any, rs: any) => {
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
          MUser.findById(req.query._id, (e, rs) => {
            if (e) return res.status(500).send(e);
            return res.status(200).json(rs);
          });
        } else {
          return res.status(500).send('invalid');
        }
      } else {
        MUser.findOne({ email: req.query.email }, (e, rs) => {
          if (e) return res.status(500).send(e);
          return res.status(200).json(rs);
        });
      }
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public insert = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body || Object.keys(req.body).length < 1 || !req.body.email) {
        return res.status(500).send('invalid');
      }
      const x = await MUser.findOne({ email: req.body.email });
      if (x) return res.status(501).send('exist');
      const password = NewGuid().split('-')[0];
      req.body.salt = NewGuid('n');
      req.body.password = MD5Hash(password + req.body.salt);
      req.body.created = { at: new Date(), by: req.verify._id, ip: getIp(req) };
      const data = new MUser(req.body);
      // data.validate()
      data.save((e: any, rs: any) => {
        if (e) return res.status(500).send(e);
        rs.password = password;
        // Push logs
        Logger.set({
          userId: req.verify._id,
          collName: 'users',
          collId: rs._id,
          method: 'insert',
          ip: getIp(req),
          userAgent: getUserAgent(req)
        });
        return res.status(201).json(rs);
      });
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body && !Array.isArray(req.body)) return res.status(500).send('invalid');
      if (req.body.length < 1) return res.status(500).send('Empty data!');
      const data: any[] = [];
      req.body.forEach(e => {
        data.push(new MUser(e));
      });
      MUser.create(data)
        .then(rs => {
          return res.status(201).json(rs);
        })
        .catch(e => {
          return res.status(500).send(e);
        });
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public insertOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) return res.status(500).send('invalid');
      const data = new MUser(req.body);
      // data.validate();
      MUser.collection.insertOne(data, (e: any, rs: any) => {
        if (e) return res.status(500).send(e);
        // Push logs
        Logger.set({
          userId: req.verify._id,
          collName: 'users',
          collId: rs._id,
          method: 'insert',
          ip: getIp(req),
          userAgent: getUserAgent(req)
        });
        return res.status(200).json(rs);
      });
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // if (!req.body._id) return res.status(500).send('invalid')
      if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid');
      if (Types.ObjectId.isValid(req.body._id)) {
        MUser.updateOne(
          { _id: req.body._id },
          {
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
          },
          (e, rs) => {
            // { multi: true, new: true },
            if (e) return res.status(500).send(e);
            // Push logs
            Logger.set({
              userId: req.verify._id,
              collName: 'users',
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

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (Types.ObjectId.isValid(req.body._id)) {
        // Find user by id
        const x = await MUser.findById(req.body._id);
        if (!x) return res.status(404).send('no_exist');
        // Generate password
        const password = NewGuid().split('-')[0];
        MUser.updateOne(
          { _id: req.body._id },
          { $set: { password: MD5Hash(password + x.salt) } },
          (e: any, rs: any) => {
            if (e) return res.status(500).send(e);
            // Push logs
            Logger.set({
              userId: req.verify._id,
              collName: 'users',
              collId: rs._id,
              method: 'reset-password',
              ip: getIp(req),
              userAgent: getUserAgent(req)
            });
            res.status(206).json({ password });
          }
        );
      } else {
        return res.status(500).send('invalid');
      }
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Find user by id
      const user = await MUser.findOne({ _id: req.verify._id });
      if (!user) return res.status(404).send('no_exist');
      // check password
      if (user.password !== MD5Hash(req.body.oldPassword + user.salt))
        return res.status(505).json({ msg: 'wrong_password' });
      // set new password
      MUser.updateOne(
        { _id: req.verify._id },
        { $set: { password: MD5Hash(req.body.newPassword + user.salt) } },
        (e, rs) => {
          if (e) return res.status(500).send(e);
          // Push logs
          Logger.set({
            userId: req.verify._id,
            collName: 'users',
            collId: user._id,
            method: 'change-password',
            ip: getIp(req),
            userAgent: getUserAgent(req)
          });
          res.status(202).json(true);
        }
      );
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public lock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { success: [] as string[], error: [] as string[] };
      for await (const _id of req.body._id) {
        // if (!validate.isBoolean(req.body.disabled)) {
        //   rs.error.push(id)
        //   continue
        // }
        const x = await MUser.findById(_id);
        if (x) {
          const _x = await MUser.updateOne({ _id }, { $set: { enable: x.enable === true ? false : true } });
          if (_x.nModified) {
            rs.success.push(_id);
            // Push logs
            Logger.set({
              userId: req.verify._id,
              collName: 'users',
              collId: _id,
              method: x.enable ? 'lock' : 'unlock',
              ip: getIp(req),
              userAgent: getUserAgent(req)
            });
          } else rs.error.push(_id);
        }
      }
      return res.status(203).json(rs);
      // if (!validate.isBoolean(req.body.disabled)) return res.status(500).send('invalid')
      // if (Types.ObjectId.isValid(req.params.id)) {
      //   MUser.updateOne({ _id: req.params.id }, { $set: { disabled: req.body.disabled } }, (e, rs) => {
      //     if (e) return res.status(500).send(e)
      //     if (!rs) return res.status(404).send('no_exist')
      //     return res.status(203).json(rs)
      //   })
      // } else {
      //   return res.status(500).send('invalid')
      // }
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public verified = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isBoolean(req.body.verified)) return res.status(500).send('invalid');
      if (Types.ObjectId.isValid(req.body._id)) {
        MUser.updateOne({ _id: req.body._id }, { $set: { verified: req.body.verified } }, (e, rs) => {
          if (e) return res.status(500).send(e);
          // Push logs
          Logger.set({
            userId: req.verify._id,
            collName: 'users',
            collId: req.params._id,
            method: 'verified',
            ip: getIp(req),
            userAgent: getUserAgent(req)
          });
          return res.status(205).json(rs);
        });
      } else {
        return res.status(500).send('invalid');
      }
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (Types.ObjectId.isValid(req.params._id)) {
        MUser.deleteOne({ _id: req.params._id }, (e: any) => {
          if (e) return res.status(500).send(e);
          // Push logs
          Logger.set({
            userId: req.verify._id,
            collName: 'users',
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
export default new UsersController();
