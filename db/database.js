/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  id: { type: Number, required: true, unique: true },
});

// Each question will have the reference to its product on its schema
// This eliminates the need to do Application level joins to find all questions for a product.
// If we want the whole set of Q and A  we will need to do a application level join
// to populate answers that are stored for this question.
const QuestionSchema = new Schema({
  product_id: { type: Number },
  question_id: { type: Number },
  question_body: { type: String },
  question_date: { type: String },
  asker_name: { type: String },
  question_helpfulness: { type: Number },
  reported: { type: Boolean },
  answers: { type: Schema.Types.ObjectId, ref: 'Answer' },
});

// NOTE - set validators for reported field in both Q and A schema

// each answer has a reference to the question id  that it is answering
// db.answers.find({question_id: question_id})  => returns all answers stored with this
// question Id.  Tradeoff would be redundancy of storing the question_id multiple times

const AnswerSchema = new Schema({
  question_id: { type: Number },
  answer_id: { type: Number },
  body: { type: String },
  date: { type: String },
  answerer_name: { type: String },
  helpfulness: { type: Number },
  reported: { type: Boolean },
  photos: {
    type: Array,
    // eslint-disable-next-line no-void
    default: void 0,
  },
});

// ^^ embedded photos initialized to 0 length. no need for application
// level joins. Trade off  === hard to get a specific photo, but easy to get all photos
// photos is unbounded. If it  got too big it could be problematic / require doc migration

const ResultsSchema = new Schema({
  product_id: { type: Number, required: true },
  results: [QuestionSchema],
});

// alternate type for photos  === new collection
const PhotosSchema = new Schema({
  id: { type: Number },
  url: { type: String },
});

module.exports = {
  questions: mongoose.model('Question', QuestionSchema),
  photos: mongoose.model('Photo', PhotosSchema),
  answers: mongoose.model('Answer', AnswerSchema),
};

/*
const PhotosSchema = new Schema({
  id: { type: Number },
  url: { type: String },
});

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

const storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

const Story = mongoose.model('Story', storySchema);
const Person = mongoose.model('Person', personSchema);
*/












