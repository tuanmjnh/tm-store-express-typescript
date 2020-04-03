declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string | 'production';
      PORT: any;
      BASE_URL: string;
      SECRET: string;
      ROOT_PATH: string;
      PUBLIC_DIR: string;
      STATIC_DIR: string;
      UPLOAD_DIR: string;
      PUBLIC_PATH: string;
      STATIC_PATH: string;
      UPLOAD_PATH: string;
    }
  }
}
import path from 'path';
import dotenv from 'dotenv';

// dotenv
// dotenv.config({ path: `.env.${process.env.NODE_ENV.toString()}` });
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
if (process.env.NODE_ENV.trim() === 'development') dotenv.config({ path: '.env.development' });
else dotenv.config({ path: '.env' });
// Root path
process.env.ROOT_PATH = __dirname;
process.env.PUBLIC_DIR = path.join(process.env.ROOT_PATH, process.env.PUBLIC_PATH); // `${process.env.ROOT_PATH}/${process.env.PUBLIC_PATH}`
process.env.STATIC_DIR = path.join(process.env.PUBLIC_DIR, process.env.STATIC_PATH);
process.env.UPLOAD_DIR = path.join(process.env.PUBLIC_DIR, process.env.UPLOAD_PATH);
process.env.PORT = process.env.PORT || 8001;
