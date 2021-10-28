const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongodbURL = 'mongodb://localhost:27017/questions_answers';
let _db;
const initDb = (callback) => {
  if (_db) {
    console.log('Database Is already intiialized');
    return callback(null, _db);
  }

  MongoClient.connect(mongodbURL)
    .then((client) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
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



/*const { Db } = require('mongodb');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/sdcdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const { connection } = mongoose;
connection.on('error', console.error.bind(console, 'connectionError'));
connection.once('open', () => {
  console.log('connected to MongoDb ');
});

*/
