const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongodb = require('mongodb').MongoClient;
const db = require('../db/connection');
const questionsRoute = require('../routes/getQuestion');

const app = express();
const port = 2500;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  // Set CORS headers so that the React SPA is able to communicate with this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/qa', questionsRoute);
db.initDb((err, dbase) => {
  if (err) {
    console.log('ERROR IN INDEX.JS', err);
  } else {
    app.listen(port, () => {
      console.log('Listening on port 2500');
    });
  }
});
