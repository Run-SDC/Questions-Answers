/* eslint-disable no-param-reassign */
/* eslint-disable prefer-const */
const { MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const db = require('./connection');

const mongodbURL = 'mongodb://localhost:27017/questions_answers';

const allQuestions = async function (prodId) {
  const client = db.getDb();

  const pipeline = [
    {
      $match: {
        product_id: 1,
        reported: 0,
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
      $set: {
        question_date: {
          $toString: {
            $toDate: '$question_date',
          },
        },
        reported: {
          $toBool: '$reported',
        },
        answers: {
          $cond: [
            {
              $lte: ['$answers', null],
            },
            {
              id: 'noanswer',
            },
            {
              id: '$answers.id',
              body: '$answers.body',
              date: {
                $toString: {
                  $toDate: '$answers.date',
                },
              },
              answerer_name: '$answers.answerer_name',
              helpfulness: '$answers.helpful',
              photos: {
                $map: {
                  input: '$answers.photos',
                  as: 'photos',
                  in: '$$photos.url',
                },
              },
            },
          ],
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
        question_helpfulness: {
          $first: '$helpful',
        },
        reported: {
          $first: '$reported',
        },

        answers: {
          $push: {
            $cond: [
              {
                $ne: [
                  {
                    $type: '$answers.id',
                  },
                  'string',
                ],
              },
              '$answers',
              {
                id: 'n',
              },
            ],
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
    {
      $project: {
        _id: 0,
      },
    },
    {
      $set: {
        answers: {
          $cond: [
            {
              $eq: ['$answers.n.id', 'n'],
            },
            {},
            '$answers',
          ],
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

const answers = async function (questionId) {
  const client = db.getDb();
  console.log('DID WE MAKE IT HERE', questionId);
  const pipeline = [
    {
      $match: {
        question_id: questionId,
        reported: 0,
      },
    },
    {
      $unwind: {
        path: '$photos',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        answer_id: '$id',
        body: '$body',
        date: {
          $toString: {
            $toDate: '$date',
          },
        },
        answerer_name: '$answerer_name',
        helpfulness: '$helpful',
        photos: {
          id: '$photos.id',
          url: '$photos.url',
        },
      },
    },
    {
      $group: {
        _id: '$answer_id',
        answer_id: {
          $first: '$answer_id',
        },
        body: {
          $first: '$body',
        },
        date: {
          $first: '$date',
        },
        answerer_name: {
          $first: '$answerer_name',
        },
        helpfulness: {
          $first: '$helpfulness',
        },
        photos: {
          $push: {
            id: '$photos.id',
            url: '$photos.url',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ];
  const cursor2 = client.db().collection('ansPhotos').aggregate(pipeline);
  let answersRes = [];

  await cursor2.forEach((answer) => {
    //   console.log('Ans',answer)
    if (!answer.photos[0].url) {
      answer.photos = [];
      console.log('What?');
    }
    answersRes.push(answer);
  });
  return answersRes;
};
// db.initDb((err, dbase) => {
//   if (err) {
//     console.log('error Connecting', err);
//   } else {
//     console.log('connected!');
//     testingAgg();
//   }
// });

module.exports = { allQuestions, answers };
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
