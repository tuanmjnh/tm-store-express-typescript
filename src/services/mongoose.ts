import { connect } from 'mongoose';
// mongoose initialize
export const initialize = () => {
  connect(process.env.MONGODB || '', { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
      console.log('Database connection is successful');
    },
    err => {
      console.log(`Error when connecting to the database ${err}`);
    },
  );
};

// const MongoClient = require('mongodb').MongoClient;
// const client = new MongoClient(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
// client.connect(() => {
//   client.close()
// })
// console.log(client)

// mongoose.set('debug', (coll, method, query, doc, options) => {
//   console.log(`${coll}.${method}`, JSON.stringify(query), doc, options);
// })
