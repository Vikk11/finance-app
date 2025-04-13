import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 100 },
        { duration: '1m', target: 200 },
        { duration: '30s', target: 0 },
    ],
    tags: { test_type: 'separate', action: 'retrieve' }
};

const BASE_URL = 'http://localhost:8083/api/transactions/';
const AUTH_TOKENS = __ENV.AUTH_TOKENS.split(',').filter(Boolean);

export default function () {
    const randomAuthToken = AUTH_TOKENS[Math.floor(Math.random() * AUTH_TOKENS.length)];

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${randomAuthToken}`,
        },
    };

    const res = http.get(`${BASE_URL}list`, params);

    check(res, {
        'is status 200': (r) => r.status === 200,
        'response contains transactions': (r) => JSON.parse(r.body).length > 0,
        'is response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}