// import { Document, Schema, model } from 'mongoose';
import Model from '../models/logger';
import { ip } from '../utils/request';
// console.log(ip.get(req), req.headers['user-agent'])

export interface ILogger {
  user_id: string;
  collection_name: string;
  collection_id: string;
  method: string;
}

const set = async (req, logger: ILogger) => {
  const data = new Model({
    c: logger.collection_name,
    cid: logger.collection_id,
    func: logger.method,
    at: new Date(),
    by: logger.user_id, // mongoose.Schema.Types.ObjectId(by)
    ip: ip(req),
    com: req.headers['user-agent'],
  });
  // data.validate()
  data.save((e, rs) => {
    if (e) return false;
    return true;
  });
};

export default set;
