/* eslint-disable quotes */
/* eslint-disable import/no-unresolved */

import http from 'k6/http';
import { check, sleep } from 'k6';

// export const options = {
//   stages: [
//     { duration: '2m', target: 10 },
//     { duration: '1m', target: 10 },
//     { duration: '1m', target: 40 },
//     { duration: '1m', target: 0 },
//   ],
//   //   vus: 10,
//   //   duration: '20s',
// };

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '60s',
      preAllocatedVUs: 1800,
      maxVUs: 2000,
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const randomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const random = randomInteger(3167104, 3518990);

  const answerPost = {
    body: 'This is a testing answer',
    name: 'TestyTesterson',
    email: 'TestmeBro@test.com',
    photos: [
      'notarealphhttps://images.unsplash.com/photo-1470116892389-0de5d9770b2c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80oto.jpg',
    ],
  };
  // test error handling later by not actually passing data in.

  const url = `http://localhost:2500/qa/questions/${random}/answers`;
  const payload = JSON.stringify(answerPost);
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const res = http.post(url, payload, params);
  //   console.log('Response time was ' + String(res.timings.duration) + ' ms');
  check(res, {
    success: (r) => r.status === 201,
    // prodId: (r) => r.body.results.product_id === randomInteger.toString(),
  });
}
