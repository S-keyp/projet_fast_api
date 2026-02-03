import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 50,          // 50 utilisateurs virtuels
    duration: '10s', // durée totale du test
};

const BASE_URL = 'http://localhost:8000';

export default function () {
    // POST create client
    let payload = JSON.stringify({
        nom: "Test",
        prenom: "K6",
        adresse: "123 Rue Exemple"
    });

    let headers = { 'Content-Type': 'application/json' };
    let resPost = http.post(`${BASE_URL}/api/v1/client/`, payload, { headers });
    check(resPost, {
        'POST /client status 200': (r) => r.status === 200,
        'POST /client has codcli': (r) => r.json().codcli !== undefined,
    });

    sleep(1);
}
