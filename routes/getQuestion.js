const { Router } = require('express');

const mongodb = require('mongodb');

const db = require('../db/connection');

const router = Router();

router.get('/', (req, res, next) => {
  const questions = [];
  db.getDb()
    .db()
    .collection('questions')
    .findOne({ product_id: 1 })
    .then((result) => {
      questions.push(result);
      res.status(200).json(questions);
    })
    .catch((err) => {
      console.log('Error in Questions Route', err);
      res.json({ message: 'An error Occured Getting Questions' });
    });
});

module.exports = router;
