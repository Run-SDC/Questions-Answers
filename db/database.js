/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  id: { type: Number, required: true, unique: true },
});

const QuestionSchema = new Schema({
  product_id: { type: Number },
  question_id: { type: Number },
  question_body: { type: String },
  question_date: { type: String },
  asker_name: { type: String },
  question_helpfulness: { type: Number },
  reported: { type: Boolean },
});

const PhotosSchema = new Schema({
  id: { type: Number },
  url: { type: String },
});
const AnswerSchema = new Schema({
  question_id: { type: Number },
  answer_id: { type: Number },
  body: { type: String },
  date: { type: String },
  answerer_name: { type: String },
  helpfulness: { type: Number },
  photos: {
    type: Array,
    // eslint-disable-next-line no-void
    default: void 0,
  },
});

module.exports = {
  questions: mongoose.model('Question', QuestionSchema),
  photos: mongoose.model('Photo', PhotosSchema),
  answers: mongoose.model('Answer', AnswerSchema),
};
