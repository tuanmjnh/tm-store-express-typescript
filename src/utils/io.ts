import * as fs from 'fs';
import * as path from 'path';
// console.log(process.env.PUBLIC_PATH)
// const public_path = `${process.env.ROOT_PATH}\\public`// `${__dirname}\\..\\public\\`
// const public_path = path.join(__dirname, `..\\${process.env.PUBLIC_DIR}`)
// module.exports.public_path = public_path
// const upload_path = `${process.env.PUBLIC_PATH}\\${process.env.UPLOAD_DIR}`
interface IOptionIO {
  dir: string;
  root?: string;
  parent?: string;
  host?: string;
}
interface IFileIO {
  id: number;
  name: string;
  fullName: string;
  path?: string;
  fullPath?: string;
  icon: string;
  size?: number;
  ext?: string;
  isFile: boolean;
  children?: IFileIO[];
}
export const createDir = async (dir: string) => {
  try {
    const listDir = dir.replace(/^\/|\/$/g, '').split('/');
    const result = {
      path: process.env.UPLOAD_DIR,
      list: [] as string[],
    };
    // create public if not exist
    if (!fs.existsSync(result.path)) await fs.mkdirSync(result.path);
    // loop list path to create
    for await (const e of listDir) {
      result.path = `${result.path}\\${e}\\`;
      if (!fs.existsSync(result.path)) {
        await fs.mkdirSync(result.path);
        result.list.push(e);
      }
    }
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const rename = async (oldPath: string, newPath: string) => {
  try {
    // if (!fs.existsSync(oldPath)) {
    await fs.renameSync(oldPath, newPath);
    return true;
    // }
    // return false
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getExtention = (dir: string, dot: boolean = true) => {
  if (!dir) return '';
  const regx = /(?:\.([^.]+))?$/;
  const rs = regx.exec(dir);
  if (rs) {
    return dir ? (dot ? rs[0] : rs[1]) : '';
  } else {
    return null;
  }
};

export const getFolder = (opt: IOptionIO) => {
  //  { dir, root, host }
  const result: IFileIO[] = [];
  opt.root = opt.root || process.env.PUBLIC_DIR;
  const _dir = path.join(opt.root, opt.dir);
  const dirs = fs.readdirSync(_dir);
  // for (const i in dirs) {
  for (let i = 0; i < dirs.length; i++) {
    const stat = fs.statSync(path.join(_dir, dirs[i]));
    const _isFile = stat.isFile();
    const item: IFileIO = {
      id: stat.ino,
      name: opt.dir[i],
      fullName: _isFile ? `${opt.host}/${opt.dir}/${dirs[i]}` : `${opt.dir}/${dirs[i]}`,
      size: stat.size,
      ext: path.extname(opt.dir[i]),
      isFile: _isFile,
      icon: _isFile ? 'file' : 'folder',
    };
    result.push(item);
  }
  return result;
};

export const getAllFolder = (opt: IOptionIO) => {
  // ({ dir, parent, root, host }) => {
  let result: IFileIO[] = [];
  opt.root = opt.root || process.env.PUBLIC_DIR;
  const _dir = path.join(opt.root, opt.dir);
  const dirs = fs.readdirSync(_dir);
  // for (const i in dirs) {
  for (let i = 0; i < dirs.length; i++) {
    const stat = fs.statSync(path.join(_dir, dirs[i]));
    const _isFile = stat.isFile();
    const item: IFileIO = {
      id: stat.ino,
      name: opt.dir[i],
      fullName: _isFile ? `${opt.host}/${opt.dir}/${dirs[i]}` : `${opt.dir}/${dirs[i]}`,
      path: opt.parent ? opt.parent : opt.dir,
      fullPath: opt.dir,
      size: stat.size,
      ext: path.extname(opt.dir[i]),
      isFile: _isFile,
      icon: _isFile ? 'file' : 'folder',
    };
    if (_isFile) {
      const items = getAllFolder({ dir: item.fullName, parent: item.name, host: opt.host });
      if (items && items.length) result = [...result, ...items];
    }
    result.push(item);
  }
  return result;
};

export const getDirectories = (opt: IOptionIO) => {
  // ({ dir, root }) => {
  const result: IFileIO[] = [];
  opt.root = opt.root || process.env.PUBLIC_DIR;
  const _dir = path.join(opt.root, opt.dir);
  const dirs = fs.readdirSync(_dir);
  for (const i of dirs) {
    // for (let i = 0; i < dirs.length; i++) {
    const stat = fs.statSync(path.join(_dir, dirs[i]));
    const item: IFileIO = {
      id: stat.ino,
      name: dirs[i],
      fullName: `${opt.dir}/${dirs[i]}`,
      fullPath: opt.dir,
      isFile: false,
      icon: 'folder',
    };
    if (stat.isDirectory()) result.push(item);
  }
  return result;
};

export const getAllDirectories = (opt: IOptionIO) => {
  // ({ dir, parent, root }) => {
  const result: IFileIO[] = [];
  opt.root = opt.root || process.env.PUBLIC_DIR;
  // root = root || `./${process.env.PUBLIC_PATH}`
  const _dir = path.join(opt.root, opt.dir);
  const dirs = fs.readdirSync(_dir);
  for (const i of dirs) {
    // for (let i = 0; i < dirs.length; i++) {
    // const _path = `${_dir}\\${dirs[i]}`
    const stat = fs.statSync(path.join(_dir, dirs[i]));
    const item: IFileIO = {
      id: stat.ino,
      name: dirs[i],
      fullName: `${opt.dir}/${dirs[i]}`,
      path: opt.parent ? opt.parent : opt.dir,
      fullPath: opt.dir,
      icon: 'folder',
      isFile: stat.isFile(),
      children: [],
    };
    if (!item.isFile) {
      item.children = getAllDirectories({ dir: item.fullName, parent: item.name });
      result.push(item);
    }
  }
  return result;
};

export const getFiles = (opt: IOptionIO) => {
  // ({ dir, root, host }) => {
  const result: IFileIO[] = [];
  opt.root = opt.root || process.env.PUBLIC_DIR;
  const _dir = path.join(opt.root, opt.dir);
  const dirs = fs.readdirSync(_dir);
  for (const i of dirs) {
    // for (let i = 0; i < dirs.length; i++) {
    const stat = fs.statSync(path.join(_dir, dirs[i]));
    const item: IFileIO = {
      id: stat.ino,
      name: dirs[i],
      fullName: `${opt.host}/${opt.dir}/${dirs[i]}`,
      size: stat.size,
      ext: path.extname(dirs[i]),
      isFile: stat.isFile(),
      icon: 'file',
    };
    if (stat.isFile()) result.push(item);
  }
  return result;
};

export const getAllFiles = (opt: IOptionIO) => {
  // ({ dir, root, parent, host }) => {
  let result: IFileIO[] = [];
  opt.root = opt.root || process.env.PUBLIC_DIR;
  const _dir = path.join(opt.root, opt.dir);
  const dirs = fs.readdirSync(_dir);
  for (const i of dirs) {
    // for (let i = 0; i < dirs.length; i++) {
    const stat = fs.statSync(path.join(_dir, dirs[i]));
    const item: IFileIO = {
      id: stat.ino,
      name: dirs[i],
      fullName: `${opt.host}/${opt.dir}/${dirs[i]}`,
      path: opt.parent ? opt.parent : opt.dir,
      fullPath: opt.dir,
      size: stat.size,
      ext: path.extname(dirs[i]),
      isFile: stat.isFile(),
      icon: 'file',
    };
    if (stat.isDirectory()) {
      const items = getAllFiles({ dir: item.fullName, parent: item.name, host: opt.host });
      if (items && items.length) result = [...result, ...items];
    }
    if (stat.isFile()) result.push(item);
  }
  return result;
};
