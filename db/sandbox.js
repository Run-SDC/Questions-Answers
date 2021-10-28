/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const QuestionFormatCSV = new Schema({
  // auto generated _id  here

  id: Number,
  product_id: Number,
  body: String,
  date_written: String,
  asker_name: String,
  asker_email: String,
  reported: Boolean,
  helpful: Number,
});

const QuestionApiFormat = new Schema({
  question_id: Number,
  question_body: String,
  question_date: String, //  actually zulu time date string
  asker_name: String,
  asker_email: String,
  question_helpfulness: Number,
  reported: Boolean,
  // eslint-disable-next-line no-undef
  Answers: [answerSchema], // answers schema here or ref to document IDs
});

const Question = Mongoose.model('Question', QuestionApiFormat);

module.exports = Question;

const insert = async function (AnswersArray) {
  for (let i = 0; i < AnswersArray.length; i++) {
    const ans = {
      answer_id: AnswersArray[i].answer_id,
      body: AnswersArray[i].body,
      date: AnswersArray[i].date,
      answerer_name: AnswersArray[i].answerer_name,
      helpfulness: AnswersArray[i].helpfulness,
      photos: AnswersArray[i].photos,
    };
    // eslint-disable-next-line no-await-in-loop
    // const inserted = new AnswerModel(ans);
    // eslint-disable-next-line no-await-in-loop
    // const saved = await inserted.save();
    // // eslint-disable-next-line no-console
    // console.log('saved', saved);
  }
};

// mongodb
//   .connect('mongodb://localhost:2500')
//   .then((client) => {
//     console.log('Connected to MongoDb');
//   })
//   .catch((err) => {
//     console.log('Error Connecting To MongoDb', err);
//   });
