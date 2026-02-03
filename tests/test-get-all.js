import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 50,          // 50 utilisateurs virtuels
    duration: '10s', // durée totale du test
};

const BASE_URL = 'http://localhost:8000';

export default function () {
    // GET all clients
    let resGetAll = http.get(`${BASE_URL}/api/v1/client/`);
    check(resGetAll, {
        'GET /clients status 200': (r) => r.status === 200,
    });

    sleep(1);
}
