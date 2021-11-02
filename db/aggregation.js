/* eslint-disable no-param-reassign */
/* eslint-disable prefer-const */
// const { MongoClient } = require('mongodb');
// const mongodb = require('mongodb');
const db = require('./connection');

const mongodbURL = 'mongodb://localhost:27017/questions_answers';

const allQuestions = async function (prodId, collection) {
  const client = db.getDb();

  const pipeline = [
    {
      $match: {
        product_id: prodId,
        reported: 0,
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
              reported: false,
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
              reported: {
                $toBool: '$answers.reported',
              },
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
      $match: {
        'answers.reported': false,
      },
    },
    {
      $project: {
        'answers.reported': 0,
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
  const cursor = client.db().collection(collection).aggregate(pipeline);
  let test = [];
  try {
    await cursor.forEach((question) => {
      test.push(question);
    });
  } catch (error) {
    return error;
  }

  return test;
};

const answers = async function (questionId, collection) {
  const client = db.getDb();
  const pipeline = [
    {
      $match: {
        question_id: questionId,
        reported: 0,
      },
    },
    {
      $unwind: {
        path: '$answers',
        includeArrayIndex: 'string',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        'answers.reported': 0,
      },
    },
    {
      $unwind: {
        path: '$answers.photos',
        includeArrayIndex: 'string',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        answer_id: '$answers.id',
        body: '$answers.body',
        date: {
          $toString: {
            $toDate: '$answers.date',
          },
        },
        answerer_name: '$answers.answerer_name',
        helpfulness: '$answers.helpful',
        photos: {
          id: '$answers.photos.id',
          url: '$answers.photos.url',
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
  const cursor2 = client.db().collection(collection).aggregate(pipeline);
  let answersRes = [];
  try {
    await cursor2.forEach((answer) => {
      if (!answer.photos[0].url) {
        answer.photos = [];
      }
      answersRes.push(answer);
    });
    return answersRes;
  } catch (error) {
    return error;
  }
};

module.exports = { allQuestions, answers };
