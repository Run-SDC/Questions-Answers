/* eslint-disable no-else-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
const mongodb = require('mongodb');
const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const app = require('../server/index');
const router = require('../routes/getQuestion');
const db = require('./connection');


const ObjectId = mongodb.ObjectId;

mongoose.Promise = global.Promise;
const MongoClient = mongodb.MongoClient;

describe('Connection', function () {
  before((done) => {
    db.initDb((err, dbase) => {
      if (err) {
        console.log('ERROR IN INDEX.JS', err);
        done();
      } else {
        done();
      }
    });
  });

  after((done) => {
    db.getDb().close(done);
  });
});

describe('Routes and database interaction', function () {
  it(' GET/qa/questions?product_id=n: Retrieves a question with all its answers ', (done) => {
    request(app)
      .get('/qa/questions?product_id=4')

      .end((err, response) => {
        assert(response.ok) === true;
        assert(response.body.product_id) === 4;
        assert(response.body.results.length) === 5;
        done();
      });
  });
  it(' GET/qa/questions/question_id/answers: Retrieves an all answers to a question in the correct format', (done) => {
    request(app)
      .get('/qa/questions/4/answers')
      .end((err, response) => {
        assert(response.ok) === true;
        assert(response.statusCode) === 200;
        done();
      });
  });
  it('POST/qa/questions: It posts a question to the database', function (done) {
    const data = {
      product_id: '1',
      body: "I'm not sure how to use this product",
      name: 'someGuy',
      email: 'someguy@guy.com',
    };
    request(app)
      .post('/qa/questions')
      .send(data)
      .end((err, response) => {
        assert(response.body) === { message: 'Created' };
        assert(response.created) === 'Created';
        assert(response.statusCode) === 201;
        done();
      });
  });
  it('POST/qa/questions:question_id/answers: It posts an answer to the database', function (done) {
    const answer = {
      name: 'Answerer',
      email: 'ans@email.com',
      body: 'I think you wear it as a hat of some sort',
      photos: [],
    };
    // id in post is the newly created question id from previous test
    request(app)
      .post('/qa/questions/3518967/answers')
      .send(answer)
      .end((err, response) => {
        assert(response.body) === { message: 'Created' };
        assert(response.statusCode) === 201;
        done();
      });
  });
  it('PUT /qa/questions/:question_id/helpful: It updates a question as helpful', function (done) {
    // id in PUT matches previously created question
    request(app)
      .put('/qa/questions/3518967/answers')
      .end((err, response) => {
        assert(response.statusCode) === 204;
        done();
      });
  });
  it('PUT /qa/questions/:question_id/report:  It updates a question to be reported ', function (done) {
    request(app)
      .put('/qa/questions/3518967/report')
      .end((err, response) => {
        assert(response.statusCode) === 204;
        done();
      });
  });
  it('PUT/qa/answers/:answer_id/helpful: It marks an answer as helfpul', function (done) {
    request(app)
      .put('/qa/answers/6879307/helpful')
      .end((err, response) => {
        assert(response.statusCode) === 204;
        done();
      });
  });
  it('PUT/qa/answers/:answer_id/report: It reports an answer', function (done) {
    request(app)
      .put('/qa/answers/6879307/report')
      .end((err, response) => {
        assert(response.statusCode) === 204;
        done();
      });
  });

  describe('Data base Queries', function () {
    it('fetches a valid question from the database', function (done) {
      db.getDb()
        .db()
        .collection('questions_answers')
        .findOne({ question_id: 4 })
        .then((res) => {
          expect(res.question_id).to.equal(4);
          done();
        });
    });
  });
  describe('Connection Helper ', function () {
    it('establishes a connection', function (done) {
      const test = function () {
        db.initDb((err, dB) => {
          if (err) {
            throw err;
          } else {
            return dB;
          }
        });
      };

      expect(test).to.not.throw();
      done();
    });
    it('returns an instance of the Database', function (done) {
      expect(db.getDb).to.not.throw();
      done();
    });
  });
});

const answersResponse = {
  id: 6879307,

  question_id: 3518967,

  body: 'I think you wear it as a hat of some sort',

  date: 1635569595031,

  answerer_name: 'Answerer',

  answerer_email: 'ans@email.com',

  helpful: 0,
  reported: 0,

  photos: [],
};
// test that route gets answers

// test that route posts questions

// test that route posts anwer s

// test that route  marks question helpful

// test that route reports questions

// test that route marks answer helpful

// test that route reports answers

// beforeEach(done=> {
//     console
// })

// const {MongoClient} = require('mongodb');

// describe('insert', () => {
//   let connection;
//   let db;

//   beforeAll(async () => {
//     connection = await MongoClient.connect(global.__MONGO_URI__, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     db = await connection.db();
//   });

//   afterAll(async () => {
//     await connection.close();
//   });

//   it('should insert a doc into collection', async () => {
//     const users = db.collection('users');

//     const mockUser = {_id: 'some-user-id', name: 'John'};
//     await users.insertOne(mockUser);

//     const insertedUser = await users.findOne({_id: 'some-user-id'});
//     expect(insertedUser).toEqual(mockUser);
//   });
// });

// function sum(a, b) {
//   return a + b;
// }
// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// })
// mongoose.connect('mongodb://localhost:27017/sdcdb', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
