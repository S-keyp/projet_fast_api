import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 50,          // 50 utilisateurs virtuels
    duration: '10s', // durée totale du test
};

const BASE_URL = 'http://localhost:8000';

export default function () {
    // Créer d'abord un client pour pouvoir le modifier
    let payload = JSON.stringify({
        nom: "Test",
        prenom: "K6",
        adresse: "123 Rue Exemple"
    });

    let headers = { 'Content-Type': 'application/json' };
    let resPost = http.post(`${BASE_URL}/api/v1/client/`, payload, { headers });
    const clientId = resPost.json().codcli;

    // PATCH client
    let patchPayload = JSON.stringify({ prenom: "K6Patched" });
    let resPatch = http.patch(`${BASE_URL}/api/v1/client/${clientId}`, patchPayload, { headers });
    check(resPatch, {
        'PATCH /client/{id} status 200': (r) => r.status === 200,
        'PATCH /client/{id} prenom modifié': (r) => r.json().prenom === "K6Patched",
    });

    sleep(1);
}
