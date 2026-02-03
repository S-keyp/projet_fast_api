import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 50,          // 50 utilisateurs virtuels
    duration: '10s', // durée totale du test
};

const BASE_URL = 'http://localhost:8000';

export default function () {
    // Test root
    let resRoot = http.get(`${BASE_URL}/`);
    check(resRoot, {
        'root status 200': (r) => r.status === 200,
        'root message correct': (r) => r.json().message === "FastAPI operational",
    });

    sleep(1);
}
