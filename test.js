import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,          // 50 utilisateurs virtuels
    duration: '10s', // durée totale du test
};

const BASE_URL = 'https://127.0.0.1:8000';

export default function () {
    // --------------------
    // Test root
    // --------------------
    let resRoot = http.get(`${BASE_URL}/`);
    check(resRoot, {
        'root status 200': (r) => r.status === 200,
        'root message correct': (r) => r.json().message === "FastAPI operational",
    });

    // --------------------
    // GET all clients
    // --------------------
    let resGetAll = http.get(`${BASE_URL}/api/v1/client/`);
    check(resGetAll, {
        'GET /clients status 200': (r) => r.status === 200,
    });

    // --------------------
    // POST create client
    // --------------------
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

    const clientId = resPost.json().codcli;

    // --------------------
    // GET client by ID
    // --------------------
    let resGetOne = http.get(`${BASE_URL}/api/v1/client/${clientId}`);
    check(resGetOne, {
        'GET /client/{id} status 200': (r) => r.status === 200,
        'GET /client/{id} correct id': (r) => r.json().codcli === clientId,
    });

    // --------------------
    // PATCH client
    // --------------------
    let patchPayload = JSON.stringify({ prenom: "K6Patched" });
    let resPatch = http.patch(`${BASE_URL}/api/v1/client/${clientId}`, patchPayload, { headers });
    check(resPatch, {
        'PATCH /client/{id} status 200': (r) => r.status === 200,
        'PATCH /client/{id} prenom modifié': (r) => r.json().prenom === "K6Patched",
    });

    // --------------------
    // DELETE client
    // --------------------
    let resDelete = http.del(`${BASE_URL}/api/v1/client/${clientId}`);
    check(resDelete, {
        'DELETE /client/{id} status 200': (r) => r.status === 200,
    });

    sleep(1);
}
