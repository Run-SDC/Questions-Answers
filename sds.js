/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const assert = require('assert');

function sum(a, b) {
  return a + b;
}
it('adds 1 + 2 to equal 3', () => {
  assert(sum(1, 2)) === 3;
});
