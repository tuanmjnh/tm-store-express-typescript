import Logger from '../../services/logger';
import Pagination from '../../utils/pagination';
import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { getIp, getUserAgent } from '../../utils/request';
import { MType } from '../../models/types';

class TestController {
  public path = '/test';
  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ data: true, method: 'get' });
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };
  public post = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ data: true, method: 'post' });
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };
  public put = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ data: true, method: 'put' });
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };
  public patch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ data: true, method: 'patch' });
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };
  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ data: true, method: 'delete' });
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };
}
export default new TestController();
