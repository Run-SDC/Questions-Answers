const fs = require('fs');


const path = require('path');
const csvParse = require('csv-parser');

const Mongoose = require('mongoose');

const models = require('../db/database');

const AnswerModel = models.answers;
const PhotosModel = models.photos;
const connection = require('../db/connection');
const Question = require('../db/sandbox');

const createQuestion = async function (row) {
  try {
    await Question.create({
      question_id: Number(row.id),
      question_body: row.body,
      question_date: row.date_written,
      asker_name: row.asker_name,
      asker_email: row.asker_email,
      reported: row.reported === '0' ? false : true,
      helpful: Number(row.helpful),
    });
    console.log('created');
  } catch (error) {
    console.log('error Creating document', error);
  }
};

fs.createReadStream(path.join(__dirname, '../../../../Desktop/qtest.csv'))
  .pipe(csvParse())
  .on('data', async (row) => {
    console.log('this is a row:', row);
    await createQuestion(row);
  })
  .on('end', () => {
    console.log('all data loaded');
  });
