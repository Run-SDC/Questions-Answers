/* eslint-disable prefer-arrow-callback */
// require('newrelic');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const compression = require('compression');
const db = require('../db/connection');
const questionsRoute = require('../routes/getQuestion');


const app = express();
const PORT = 2500;
// const HOST = '0.0.0.0';
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET,POST,PUT,PATCH,DELETE,OPTIONS'
//   );

//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });
app.get('/', (req, res, next) => {
  res.end(`<h1>${process.env.MESSAGE}</h1>`);
});

app.get('/loaderio-327fbf065cf68f74934c4fdaff11f0ed.txt', (req, res, next) => {
  const options = {
    root: path.join(__dirname),
  };

  const fileName = 'loader.txt';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});
app.use('/qa', questionsRoute);

db.initDb((err, dbase) => {
  if (err) {
    console.log('ERROR IN INDEX.JS', err);
  } else {
    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    });
  }
});

module.exports = app;
