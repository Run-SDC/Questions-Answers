/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-unused-vars */
const express = require('express');
const axios = require('axios');
const dbConnection = require('../db/connection');
const models = require('../db/database');
const AnswerModel = models.answers;
const PhotosModel = models.photos;

const dummy = require('../mockData');
const { answers } = dummy;
const app = express();
const port = 2500;

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
    const inserted = new AnswerModel(ans);
    // eslint-disable-next-line no-await-in-loop
    const saved = await inserted.save();
    // eslint-disable-next-line no-console
    console.log('saved', saved);
  }
};

insert(answers.results);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port 2500');
});
