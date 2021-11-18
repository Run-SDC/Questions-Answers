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
      duration: '12s',
      preAllocatedVUs: 1800,
      maxVUs: 2000,
    },
  },
  thresholds: {
    http_req_duration: ['avg<500', 'p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const randomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const random = randomInteger(900000, 940000);

  const res = http.get(
    `http://54.90.131.23/qa/questions?product_id=${random}`
  );

  check(res, {
    success: (r) => r.status === 200,
  });
}
