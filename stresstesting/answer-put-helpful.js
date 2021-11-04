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
  const random = randomInteger(500000, 6879307);


  // test error handling later by not actually passing data in.

  const url = `http://localhost:2500/qa/answers/${random}/helpful`;
  // const payload = JSON.stringify(questionPost);
  // const params = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };
  const res = http.put(url);
  //   console.log('Response time was ' + String(res.timings.duration) + ' ms');
  check(res, {
    success: (r) => r.status === 204,
    // prodId: (r) => r.body.results.product_id === randomInteger.toString(),
  });
}
