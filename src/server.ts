import './utils/prototypes';
import './config';

// Appliction
import app from './services/app';
app
  .listen(process.env.PORT) // , '192.168.1.10' // '127.0.0.1'
  .on('listening', () => {
    // process.env.HOST = `http://${server.address().address}:${port}`
    console.log(`Web server listening on: ${process.env.PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV}`);
    console.log(`Base URL: ${process.env.BASE_URL}`);
  })
  .on('error', (err) => {
    console.log(err);
  });
