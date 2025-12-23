import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "2m", target: 2000 },
    { duration: "1m", target: 2000 },
    { duration: "2m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.01"],
  },
};

const BASE_URL = __ENV.API_URL || "https://app.dumbell.co.in";

export default function () {
  // Read random item (1-10)
  const id = Math.floor(Math.random() * 10) + 1;
  const res = http.get(`${BASE_URL}/api/items/${id}`);

  check(res, { "GET 200": (r) => r.status === 200 });

  sleep(0.5);
}
