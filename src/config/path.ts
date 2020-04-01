import path from 'path';
//
process.env.PUBLIC_DIR = path.join(process.env.ROOT_PATH, process.env.PUBLIC_PATH); // `${process.env.ROOT_PATH}/${process.env.PUBLIC_PATH}`
process.env.STATIC_DIR = path.join(process.env.PUBLIC_DIR, process.env.STATIC_PATH);
process.env.UPLOAD_DIR = path.join(process.env.PUBLIC_DIR, process.env.UPLOAD_PATH);
