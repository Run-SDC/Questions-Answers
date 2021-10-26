/* eslint-disable prefer-const */
const { MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const db = require('./connection');

const mongodbURL = 'mongodb://localhost:27017/questions_answers';

const testingAgg = async function (prodId) {
  const client = db.getDb();

  const pipeline = [
    {
      $match: {
        product_id: 1,
      },
    },
    {
      $lookup: {
        from: 'ansPhotos',
        localField: 'question_id',
        foreignField: 'question_id',
        as: 'answers',
      },
    },
    {
      $unwind: {
        path: '$answers',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        question_id: '$question_id',
        question_body: '$question_body',
        question_date: '$question_date',
        asker_name: '$asker_name',
        reported: '$reported',
        answers: {
          id: '$answers.id',
          body: '$answers.body',
          date: '$answers.date',
          answerer_name: '$answerer_name',
          helpfulness: '$answers.helpful',
          photos: '$answers.photos.url',
        },
      },
    },
    {
      $group: {
        _id: '$question_id',
        question_id: {
          $first: '$question_id',
        },
        question_body: {
          $first: '$question_body',
        },
        question_date: {
          $first: '$question_date',
        },
        asker_name: {
          $first: '$asker_name',
        },
        reported: {
          $first: '$reported',
        },
        answers: {
          $push: '$answers',
        },
      },
    },
  ];
  const cursor = client.db().collection('questions').aggregate(pipeline);
  let test = [];
  await cursor.forEach((question) => {
    test.push(question);
  });

  return test;
};

// db.initDb((err, dbase) => {
//   if (err) {
//     console.log('error Connecting', err);
//   } else {
//     console.log('connected!');
//     testingAgg();
//   }
// });

module.exports = testingAgg;
const pipe2 = [
  {
    $match: {
      product_id: 1,
    },
  },
  {
    $lookup: {
      from: 'ansPhotos',
      localField: 'question_id',
      foreignField: 'question_id',
      as: 'answers',
    },
  },
  {
    $unset: [
      '_id',
      'answers._id',
      'answers.photos._id',
      'product_id',
      'asker_email',
      'answers.photos.id',
      'answers.photos.answer_id',
      'id',
    ],
  },
  {
    $addFields: {
      'answers.photos': {
        $map: {
          input: '$answers.photos',
          as: 'el',
          in: '$$el.url',
        },
      },
    },
  },
  {
    $addFields: {
      answers: {
        $arrayToObject: {
          $map: {
            input: '$answers',
            in: {
              k: {
                $toString: '$$this.id',
              },
              v: '$$this',
            },
          },
        },
      },
    },
  },
];
