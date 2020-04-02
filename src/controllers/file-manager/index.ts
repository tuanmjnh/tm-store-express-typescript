import formidable from 'formidable';
import * as io from '../../utils/io';
import { Request, Response, NextFunction } from 'express';
import { getIp, getHost, getUserAgent } from '../../utils/request';

interface IFile {
  id?: number;
  name: string;
  fullName: string;
  path?: string;
  fullPath?: string;
  icon: string;
  size?: number;
  ext?: string;
  type: string;
  isFile: boolean;
}

class FileManagerController {
  public path = '/file-manager';
  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query.dir = req.query.dir || process.env.UPLOAD_PATH;
      const result = io.getAllFolder({ dir: req.query.dir });
      if (result)
        res
          .status(201)
          .json(result)
          .end();
      else
        res
          .status(404)
          .json({ msg: 'exist', params: 'data' })
          .end();
    } catch (e) {
      console.log(e);
      return res.status(500).send('invalid');
    }
  };

  public getDirectories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query.dir = req.query.dir || process.env.UPLOAD_PATH;
      const result = io.getAllDirectories({ dir: req.query.dir });
      if (result) {
        res
          .status(201)
          .json([
            {
              id: 0,
              name: 'Root',
              fullName: '',
              directory: '',
              fullPath: '',
              icon: 'folder',
              children: result,
            },
          ])
          .end();
      } else
        res
          .status(404)
          .json({ msg: 'exist', params: 'data' })
          .end();
    } catch (e) {
      console.log(e);
      // return res.status(500).send(e)
      return res.status(500).json({ error: e, dir: process.env.PUBLIC_DIR });
    }
  };

  public getFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query.dir = req.query.dir || process.env.UPLOAD_PATH;
      const result = io.getFiles({ dir: req.query.dir, host: getHost(req) });
      if (result)
        res
          .status(201)
          .json(result)
          .end();
      else
        res
          .status(404)
          .json({ msg: 'exist', params: 'data' })
          .end();
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  };

  public post = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const form = new formidable.IncomingForm();
      const uploadPath = req.headers['upload-path'] || '';
      const createdDir = await io.createDir(uploadPath as string);
      const rename = req.headers['upload-rename'] === 'true' ? true : false;
      form.uploadDir = createdDir.path;
      form.keepExtensions = true;
      // form.multiples = true
      form.maxFileSize = 5 * 1024 * 1024; // Max 5MB

      // form.on('fileBegin', function(name, file) {
      // })
      form.on('file', (field, file) => {
        // rename the incoming file to the file's name
        if (rename) {
          const tmp = file.path.split('\\');
          file.name = tmp[tmp.length - 1].replace('upload_', '');
        }
        io.rename(file.path, `${form.uploadDir}/${file.name}`);
      });

      form.on('error', e => {
        console.log('an error has occured with form upload');
        req.resume();
      });

      form.on('aborted', e => {
        console.log('user aborted upload');
      });

      // form.on('end', (fields, files) => {});

      form.onPart = function(part) {
        if (part.filename) {
          // || part.filename.match(/\.(jpg|jpeg|png)$/i)
          this.handlePart(part);
        } else {
          console.log(part.filename + ' is not allowed');
        }
      };

      form.parse(req, (err, fields, files) => {
        const rs: IFile[] = []; // await dbapi.create(body)
        const fileKeys = Object.keys(files);
        if (fileKeys.length > 0) {
          const file = files[0];
          rs.push({
            name: file.name,
            fullName: `${getHost(req)}/${process.env.UPLOAD_DIR}/${req.headers['upload-path']}/${file.name}`,
            size: file.size,
            ext: io.getExtention(file.name) || '',
            icon: 'file',
            path: `${process.env.UPLOAD_DIR}/${req.headers['upload-path']}`,
            type: file.type,
            isFile: true,
          });
        }
        if (rs) {
          res
            .status(201)
            .json(rs)
            .end();
        } else {
          res
            .status(404)
            .json({ msg: 'exist', params: 'data' })
            .end();
        }
      });
      // const tmp_file = {
      //   path: req.headers['upload-path'],
      //   size: file.size,
      //   originalname: file.name,
      //   filename: rename ? file.path : `${req.headers['upload-path']}/${file.name}`,
      //   extension: io.getExtention(file.name),
      //   mimetype: file.type
      // }
      // result.push(tmp_file)
      // for (const e of req.files) {
      //   result.push({
      //     path: req.headers.path,
      //     size: e.size,
      //     originalname: e.filename,
      //     filename: `${req.headers.path}/${e.filename}`,
      //     extension: io.getExtention(e.filename),
      //     mimetype: e.mimetype
      //   })
      // }
      // console.log(result)
      // if (result) res.status(201).json(result).end()
      // else res.status(404).json({ msg: 'exist', params: 'data' }).end()
    } catch (e) {
      return res.status(500).send('invalid');
    }
  };
}
export default new FileManagerController();
