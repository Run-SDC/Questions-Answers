/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  id: { type: Number, required: true, unique: true },
});

const QuestionSchema = new Schema({
  product_id: { type: Number, required: true },
  question_id: { type: Number, required: true },
  question_body: { type: String, required: true },
  question_date: { type: String, required: true },
  asker_name: { type: String, required: true },
  question_helpfulness: { type: Number, required: true },
  reported: { type: Boolean, required: true },
});

const PhotosSchema = new Schema({
  id: { type: Number, required: true },
  url: { type: String, required: true },
});
const AnswerSchema = new Schema({
  question_id: { type: Number, required: true },
  answer_id: { type: Number, required: true },
  body: { type: String, required: true },
  date: { type: String, required: true },
  answerer_name: { type: String, required: true },
  helpfulness: { type: Number, required: true },
  photos: [PhotosSchema],
});
