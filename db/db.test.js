/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const router = require('../routes/getQuestion');

before((done) => {
  mongoose.connect('mongodb://localhost:27017/sdcdb', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'Error Connectin to sdcdb DB'));
  db.once('open', function () {
    console.log('Connected Succesfully ');
  });
});

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
// });
