/* eslint-disable object-shorthand */
const { Router } = require('express');

const mongodb = require('mongodb');

const db = require('../db/connection');

const router = Router();
//GET /qa/questions
//params product_id integer page (page is which page of results to return ) integer count integer
//( count is results per page )
//need format with agg pipeline
router.get('/questions', (req, res, next) => {
  const productID = Number(req.query.product_id);
  console.log('req.query', productID);
  const questions = [];
  db.getDb()
    .db()
    .collection('questions')
    .find({ product_id: productID })
    .forEach((question) => {
      questions.push(question);
    })
    .then((result) => {
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
router.get('/questions/:question_id/answers', (req, res, next) => {
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
//{_id:ObjectId('6175baed208d1634f72da402')}
router.post('/questions', (req, res, next) => {
  // NUMBER on quwestionid and productID for now, have to see how its coming into from API
  // remember to reload with CSV HEADER question_helpfulness and qustion_date
  // highest question ID = 3518959
  const body = {
    question_id: 23232323,
    product_id: Number(req.body.product_id),
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

/*
POST /qa/questions/:question_id/answers

parameters  = question_id integer
Body parameters
body text
name text
email text
photos text array ?
res 201 created
*/
// change to helpfulness in CSV file to avoid other transformations
router.post('/questions/:question_id/answers', (req, res, next) => {
  // need schema validation / some way of creating new answerID
  // highest answer id 6879306
  // need to handle photos nested in questions.
  const questionid = Number(req.params.question_id);
  const answer = {
    question_id: 23232323,
    answer_id: 12121212,
    body: req.body.body,
    date: Date.now(),
    answerer_name: req.body.name,
    answerer_email: req.body.email,
    helpfulness: 0,
    reported: 0,
    photos: [req.body.photos],
  };
  console.log('req.body', req.body, questionid, answer);
  db.getDb()
    .db()
    .collection('ansPhotos')
    .insertOne(answer)
    .then((result) => {
      console.log('POSTANSWERRESULT', result);
      res.status(201).json({ message: 'Created' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred.' });
    });

  // res.json({ message: req.body });
  next();
});

// mark question helpful RES  StATUS 204: NO CONTENT
router.put('/questions/:question_id/helpful', (req, res, next) => {
  // we need an incrementer for question helpfulness, probably an $INC
  // these routes will look very similar... how to avoid calling question by accident when
  //trying to post answer as helpful or vice versa?
  const question_id = Number(req.params.question_id);
  db.getDb()
    .db()
    .collection('questions')
    .updateOne(
      { question_id: question_id },
      { $set: { question_helpfulness: 2 } }
    )
    .then((result) => {
      console.log('PutquestionHelpful', result);
      res.status(204);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred.' });
    });
  console.log('question_id', question_id);

  res.send('ok');
});
//report question RES  StATUS 204: NO CONTENT
router.put('/questions/:question_id/report', (req, res, next) => {
  const question_id = Number(req.params.question_id);

  db.getDb()
    .db()
    .collection('questions')
    .updateOne({ question_id: question_id }, { $set: { reported: 1 } })
    .then((result) => {
      console.log('Report Question', result);
      res.status(204);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred.' });
    });
  console.log('question_id', question_id);

  res.send('ok');
});

// mark answer helpfulRES  StATUS 204: NO CONTENT
router.put('/answers/:answer_id/helpful', (req, res, next) => {
  const answerId = Number(req.params.answer_id);
  // index answerIDS to improve write operations

  db.getDb()
    .db()
    .collection('ansPhotos')
    .updateOne({ answer_id: answerId }, { $set: { helpful: 1 } })
    .then((result) => {
      console.log('Answer Marked Helpful', result);
      res.status(204);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred.' });
    });
  console.log('answer_id', answerId);

  res.send('ok');
});

// report answer RES  StATUS 204: NO CONTENT
router.put('/answers/:answer_id/report', (req, res, next) => {
  const answerId = Number(req.params.answer_id);
  db.getDb()
    .db()
    .collection('ansPhotos')
    .updateOne({ answer_id: answerId }, { $set: { reported: 1 } })
    .then((result) => {
      console.log('Report Question', result);
      res.status(204).send('No Content');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred.' });
    });
  console.log('answer_id', answerId);
});
// mark question helpful

module.exports = router;
/*













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
