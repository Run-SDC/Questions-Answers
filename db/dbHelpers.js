const monngodb = require('mongodb');
const db = require('./connection');

const getNextSequenceValue = function (sequenceName) {
  let counter;
  console.log('HEREHEREHER');
  db.getDb().db().collection('counters').find({ _id: 'question_id' });
  // .findAndModify({
  //   query: { _id: 'question_id' },
  //   update: { $inc: { sequence_value: 1 } },
  //   new: true,
  // })
  // .then((result) => {
  //   console.log('result');
  // });
  //   const sequenceDocument = db.counters.findAndModify({
  //     query: { _id: sequenceName },
  //     update: { $inc: { sequence_value: 1 } },
  //     new: true,
  //   });
  //   return sequenceDocument.sequence_value;
};
module.exports = getNextSequenceValue;
