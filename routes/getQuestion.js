const { Router } = require('express');

const mongodb = require('mongodb');

const db = require('../db/connection');

const router = Router();
//GET /qa/questions
//params product_id integer page (page is which page of results to return ) integer count integer
//( count is results per page )
//need format with agg pipeline
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

/*
GET /qa/questions/:question_id/answers
params question_id integer
quwrey params
page integer
count integer
res = 200 ok  + structure
*/
// works with basic response = need agg pipeline
router.get('/:question_id/answers', (req, res, next) => {
  const answers = [];

  console.log('REQ', req.body, req.params, req.query);

  // req.params = anyhthing in the/: format = the server is expecting it
  const questionID = Number(req.params.question_id);

  console.log('this', typeof questionID);

  ///req.query = any thing with the ?  operator in teh query string

  db.getDb()
    .db()
    .collection('ansPhotos')
    .find({ question_id: questionID })
    .forEach((answer) => {
      answers.push(answer);
    })
    .then((result) => {
      console.log('do we get here');
      answers.push(result);
      res.status(200).json(answers);
    })
    .catch((err) => {
      console.log('Error in Questions Route', err);
      res.json({ message: 'An error Occured Getting Questions' });
    });
});

/*POST /qa/questions
body params
body text
name text
email text
product_id  text

RES status: 201 CREATED
*/
// basic post without validation
// need incrementer + mongoose schema
router.post('/', (req, res, next) => {
  const body = {
    question_id: 23232323,
    question_body: req.body.body,
    question_date: Date.now(),
    asker_name: req.body.name,
    asker_email: req.body.email,
    question_helpfulness: 0,
    reported: 0,
  };

  db.getDb()
    .db()
    .collection('questions')
    .insertOne(body)
    .then((result) => {
      console.log('POSTQUESTIONSRESULT', result);
      res.status(201).json({ message: 'Created' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred.' });
    });
  console.log('req.body', body);

  // res.json({ message: req.body });
});
module.exports = router;
/*









POST /qa/questions/:question_id/answers

parameters  = question_id integer

Body parameters

body text
name text
email text
photos text

res 201 created

PUT /qa/questions/:question_id/helpful

parameter question _id  = id of qustion to update

RES 204 NO CONTENT



PUT /qa/questions/:question_id/report
parameters question_id integer

RES = 204 NO CONTENT

PUT /qa/answers/:answer_id/helpful

parameters answer_id   integer

RES Status 204 NO CONTENT


PUT /qa/answers/:answer_id/report

parameters = answer_id integer

RES  StATUS 204: NO CONTENT
*/
