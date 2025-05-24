import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:30081/api/transactions/';
const AUTH_TOKENS = __ENV.AUTH_TOKENS.split(',').filter(Boolean);

export const options = {
    scenarios: {
        create_transactions: {
            executor: 'ramping-vus',
            exec: 'createTransaction',
            stages: [
                { duration: '30s', target: 100 },
                { duration: '1m', target: 200 },
                { duration: '30s', target: 0 },
            ],
            tags: { test_type: 'combined', action: 'create' }
        },
        retrieve_transactions: {
            executor: 'ramping-vus',
            exec: 'retrieveTransactions',
            stages: [
                { duration: '30s', target: 100 },
                { duration: '1m', target: 200 },
                { duration: '30s', target: 0},
            ],
            tags: { test_type: 'combined', action: 'retrieve' }
        },
    }
};

export function createTransaction() {
    const randomAuthToken = AUTH_TOKENS[Math.floor(Math.random() * AUTH_TOKENS.length)];
    const type = Math.random() > 0.5 ? 'INCOME' : 'EXPENSE';
    const categoryId = type === 'INCOME' ? 15 : Math.floor(Math.random() * 14) + 1;

    const payload = JSON.stringify({
        amount: Math.floor(Math.random() * 1000),
        type: type,
        categoryId: categoryId,
        relatedUserId: null,
        name: 'Test Transaction',
        date: new Date().toISOString(),
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${randomAuthToken}`,
        },
    };

    const res = http.post(`${BASE_URL}add`, payload, params);

    check(res, {
        'create: status 200': (r) => r.status === 200,
        'create: response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}

export function retrieveTransactions() {
    const randomAuthToken = AUTH_TOKENS[Math.floor(Math.random() * AUTH_TOKENS.length)];

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${randomAuthToken}`,
        },
    };

    const res = http.get(`${BASE_URL}recentTransactions`, params);

    check(res, {
        'retrieve: status 200': (r) => r.status === 200,
        'retrieve: has date': (r) => JSON.parse(r.body).length > 0,
        'retrieve: response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}