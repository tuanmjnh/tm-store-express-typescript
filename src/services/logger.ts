import { ILogger, MLogger } from '../models/logger';
// console.log(ip.get(req), req.headers['user-agent'])

class Logger {
  public set = async (logger: ILogger | any) => {
    // const data = new Model({
    //   c: logger.collection_name,
    //   cid: logger.collection_id,
    //   method: logger.method,
    //   at: new Date(),
    //   by: logger.user_id, // mongoose.Schema.Types.ObjectId(by)
    //   ip: logger.ip,
    //   com: req.headers['user-agent'],
    // });
    const data = new MLogger(logger);
    // data.validate()
    data.save((e, rs) => {
      if (e) return false;
      return true;
    });
  };
}
export default new Logger();
