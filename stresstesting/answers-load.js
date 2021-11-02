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
      rate: 10,
      timeUnit: '1s',
      duration: '10s',
      preAllocatedVUs: 20,
      maxVUs: 100,
    },
  },
  thresholds: {
    http_req_duration: ['avg<100', 'p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const randomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const random = randomInteger(3167104, 3519005);

  const res = http.get(
    `http://localhost:2500/qa/questions/${random}/answers`
  );
  //   console.log('Response time was ' + String(res.timings.duration) + ' ms');
  check(res, {
    success: (r) => r.status === 200,
    // prodId: (r) => r.body.results.product_id === randomInteger.toString(),
  });
}
