const mongodb = require('mongodb');
const db = require('./connection');

const getNextSequenceValue = async function (sequenceName) {
  let counter;
  // refactor to take a different collection in parameters
  try {
    const test = await db
      .getDb()
      .db()
      .collection('counters')
      .findOneAndUpdate({ _id: sequenceName }, { $inc: { sequence_value: 1 } });
    counter = test.value.sequence_value;
    return counter;
  } catch (error) {
    console.log('Error Getting Next Sequence Value:', error);
  }
};
module.exports = getNextSequenceValue;
