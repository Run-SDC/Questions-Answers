/* eslint-disable quotes */
const mongodb = require('mongodb');


const MongoClient = mongodb.MongoClient;

let _db;
const initDb = (callback) => {
  if (_db) {
    console.log('Database Is already intiialized');
    return callback(null, _db);
  }
  if (process.env.NODE_ENV !== 'test') {
    const mongoProdUrl = `mongodb://${process.env.MONGOUSER}:${process.env.MONGO_PASS}@54.172.122.137:27017/questions_answers?authSource=admin`;
    const mongodbURL = 'mongodb://localhost:27017/questions_answers';

    MongoClient.connect(mongoProdUrl)
      .then((client) => {
        _db = client;
        callback(null, _db);
      })
      .catch((err) => {
        callback(err);
      });
  } else {
    const mongodbURL = 'mongodb://localhost:27017/sdcdb';
    MongoClient.connect(mongodbURL)
      .then((client) => {
        _db = client;
        callback(null, _db);
      })
      .catch((err) => {
        callback(err);
      });
  }
};

const getDb = () => {
  if (!_db) {
    throw Error('Database not Initialized!');
  }
  return _db;
};

module.exports = {
  initDb,
  getDb,
};

