/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const { Db } = require('mongodb');
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
module.exports = connection;
