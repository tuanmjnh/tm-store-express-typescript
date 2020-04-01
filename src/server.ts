declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: number;
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
if (process.env.NODE_ENV.toString() === 'development') dotenv.config({ path: '.env.development' });
else dotenv.config({ path: '.env' });

// Root path
process.env.ROOT_PATH = __dirname;
process.env.PUBLIC_DIR = path.join(process.env.ROOT_PATH, process.env.PUBLIC_PATH); // `${process.env.ROOT_PATH}/${process.env.PUBLIC_PATH}`
process.env.STATIC_DIR = path.join(process.env.PUBLIC_DIR, process.env.STATIC_PATH);
process.env.UPLOAD_DIR = path.join(process.env.PUBLIC_DIR, process.env.UPLOAD_PATH);

// Appliction
import app from './services/app';
app
  .listen(process.env.PORT || 8001) // , '192.168.1.10' // '127.0.0.1'
  .on('listening', () => {
    // process.env.HOST = `http://${server.address().address}:${port}`
    console.log(`Web server listening on: ${process.env.PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV}`);
  })
  .on('error', err => {
    console.log(err);
  });
