import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 100},
        { duration: '1m', target: 200 },
        { duration: '30s', target: 0 },
    ],
    tags: { test_type: 'separate', action: 'create' }
};

const BASE_URL = 'http://localhost:30081/api/transactions/';
const AUTH_TOKENS = __ENV.AUTH_TOKENS.split(',').filter(Boolean);

export default function () {
    const randomAuthToken = AUTH_TOKENS[Math.floor(Math.random() * AUTH_TOKENS.length)];
    const type = Math.random() > 0.5 ? 'INCOME' : 'EXPENSE';

    const categoryId = type === 'INCOME'
        ? 15
        : Math.floor(Math.random() * 14) + 1;

    const payload = JSON.stringify({
        amount: Math.floor(Math.random() * 1000),
        type: type,
        categoryId: categoryId,
        relatedUserId: null,
        name: 'Test Transaction',
    });

    const params = {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${randomAuthToken}`,
        },
    };

    const res = http.post(`${BASE_URL}add`, payload, params);

    check(res, {
        'is status 200': (r) => r.status === 200,
        'is response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}