/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
const mongodb = require('mongodb');
const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/index');
const router = require('../routes/getQuestion');
const db = require('./connection');
// const db = mongoose.connection;

mongoose.Promise = global.Promise;
const MongoClient = mongodb.MongoClient;

describe('Connection', function () {
  before((done) => {
    db.initDb((err, dbase) => {
      if (err) {
        console.log('ERROR IN INDEX.JS', err);
        done();
      } else {
        // db.getDb(done);
        done();
      }
    });
  });

  after((done) => {
    db.getDb().close(done);
  });
});

//   // db.on('error', console.error.bind(console, 'Error Connectin to sdcdb DB'));
//   // db.once('open', function () {
//   //   console.log('Connected Succesfully ');
//   //   done();
//   // });
// });

// afterEach((done) => {
//   // console.log('WE MADE IT HERE');
//   // db.close();
//   // db.getDb().close(done);
//   db.getDb().close(done);
//   // db.getDb().close(() => {
//   //   console.log('WERE IN THE OTHER ONE');
//   //   done();
//   // });
// });

// test that route gets  a question list

// how to make sure connection runs for test env.

describe('Routes and database interaction', function () {
  it(' GET/qa/questions?product_id=n: Retrieves a question with all its answers ', (done) => {
    request(app)
      .get('/qa/questions?product_id=4')

      .end((err, response) => {
        console.log('response=========', response.body);
        done();
      });
  });
  it(' GET/qa/questions/question_id/answers: Retrieves an all answers to a question in the correct format', (done) => {
    request(app)
      .get('/qa/questions/4/answers')
      .end((err, response) => {
        console.log('RESPONSE', response.body);
        done();
      });
  });
  it.only('POST/qa/questions: It posts a question to the database', function (done) {
    request(app)
      .post('/questions')
      .end((err, response) => {
        console.log('POST QUESTIONS', response.body);
        done();
      });
  });
  xit('POST/qa/questions:question_id/answers: It posts an answer to the database', function (done) {
    done();
  });
  xit('PUT /qa/questions/:question_id/helpful: It updates a question as helpful', function (done) {
    done();
  });
  xit('PUT /qa/questions/:question_id/report:  It updates a question to be reported ', function (done) {
    done();
  });
  xit('PUT/qa/answers/:answer_id/helpful: It marks an answer as helfpul', function (done) {
    done();
  });
  xit('PUT/qa/answers/:answer_id/report: It reports a question', function (done) {
    done();
  });
});

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
