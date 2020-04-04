"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
exports.createDir = (dir) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    try {
        const listDir = dir.replace(/^\/|\/$/g, '').split('/');
        const result = {
            path: process.env.UPLOAD_DIR,
            list: [],
        };
        // create public if not exist
        if (!fs.existsSync(result.path))
            yield fs.mkdirSync(result.path);
        try {
            // loop list path to create
            for (var listDir_1 = __asyncValues(listDir), listDir_1_1; listDir_1_1 = yield listDir_1.next(), !listDir_1_1.done;) {
                const e = listDir_1_1.value;
                result.path = `${result.path}\\${e}\\`;
                if (!fs.existsSync(result.path)) {
                    yield fs.mkdirSync(result.path);
                    result.list.push(e);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (listDir_1_1 && !listDir_1_1.done && (_a = listDir_1.return)) yield _a.call(listDir_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.rename = (oldPath, newPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // if (!fs.existsSync(oldPath)) {
        yield fs.renameSync(oldPath, newPath);
        return true;
        // }
        // return false
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.getExtention = (dir, dot = true) => {
    if (!dir)
        return '';
    const regx = /(?:\.([^.]+))?$/;
    const rs = regx.exec(dir);
    if (rs) {
        return dir ? (dot ? rs[0] : rs[1]) : '';
    }
    else {
        return null;
    }
};
exports.getFolder = (opt) => {
    //  { dir, root, host }
    const result = [];
    opt.root = opt.root || process.env.PUBLIC_DIR;
    const _dir = path.join(opt.root, opt.dir);
    const dirs = fs.readdirSync(_dir);
    // for (const i in dirs) {
    for (let i = 0; i < dirs.length; i++) {
        const stat = fs.statSync(path.join(_dir, dirs[i]));
        const _isFile = stat.isFile();
        const item = {
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
exports.getAllFolder = (opt) => {
    // ({ dir, parent, root, host }) => {
    let result = [];
    opt.root = opt.root || process.env.PUBLIC_DIR;
    const _dir = path.join(opt.root, opt.dir);
    const dirs = fs.readdirSync(_dir);
    // for (const i in dirs) {
    for (let i = 0; i < dirs.length; i++) {
        const stat = fs.statSync(path.join(_dir, dirs[i]));
        const _isFile = stat.isFile();
        const item = {
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
            const items = exports.getAllFolder({ dir: item.fullName, parent: item.name, host: opt.host });
            if (items && items.length)
                result = [...result, ...items];
        }
        result.push(item);
    }
    return result;
};
exports.getDirectories = (opt) => {
    // ({ dir, root }) => {
    const result = [];
    opt.root = opt.root || process.env.PUBLIC_DIR;
    const _dir = path.join(opt.root, opt.dir);
    const dirs = fs.readdirSync(_dir);
    for (const i of dirs) {
        // for (let i = 0; i < dirs.length; i++) {
        const stat = fs.statSync(path.join(_dir, dirs[i]));
        const item = {
            id: stat.ino,
            name: dirs[i],
            fullName: `${opt.dir}/${dirs[i]}`,
            fullPath: opt.dir,
            isFile: false,
            icon: 'folder',
        };
        if (stat.isDirectory())
            result.push(item);
    }
    return result;
};
exports.getAllDirectories = (opt) => {
    // ({ dir, parent, root }) => {
    const result = [];
    opt.root = opt.root || process.env.PUBLIC_DIR;
    // root = root || `./${process.env.PUBLIC_PATH}`
    const _dir = path.join(opt.root, opt.dir);
    const dirs = fs.readdirSync(_dir);
    for (const i of dirs) {
        // for (let i = 0; i < dirs.length; i++) {
        // const _path = `${_dir}\\${dirs[i]}`
        const stat = fs.statSync(path.join(_dir, dirs[i]));
        const item = {
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
            item.children = exports.getAllDirectories({ dir: item.fullName, parent: item.name });
            result.push(item);
        }
    }
    return result;
};
exports.getFiles = (opt) => {
    // ({ dir, root, host }) => {
    const result = [];
    opt.root = opt.root || process.env.PUBLIC_DIR;
    const _dir = path.join(opt.root, opt.dir);
    const dirs = fs.readdirSync(_dir);
    for (const i of dirs) {
        // for (let i = 0; i < dirs.length; i++) {
        const stat = fs.statSync(path.join(_dir, dirs[i]));
        const item = {
            id: stat.ino,
            name: dirs[i],
            fullName: `${opt.host}/${opt.dir}/${dirs[i]}`,
            size: stat.size,
            ext: path.extname(dirs[i]),
            isFile: stat.isFile(),
            icon: 'file',
        };
        if (stat.isFile())
            result.push(item);
    }
    return result;
};
exports.getAllFiles = (opt) => {
    // ({ dir, root, parent, host }) => {
    let result = [];
    opt.root = opt.root || process.env.PUBLIC_DIR;
    const _dir = path.join(opt.root, opt.dir);
    const dirs = fs.readdirSync(_dir);
    for (const i of dirs) {
        // for (let i = 0; i < dirs.length; i++) {
        const stat = fs.statSync(path.join(_dir, dirs[i]));
        const item = {
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
            const items = exports.getAllFiles({ dir: item.fullName, parent: item.name, host: opt.host });
            if (items && items.length)
                result = [...result, ...items];
        }
        if (stat.isFile())
            result.push(item);
    }
    return result;
};
//# sourceMappingURL=io.js.map