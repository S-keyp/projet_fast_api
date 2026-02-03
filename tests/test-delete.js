import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 50,          // 50 utilisateurs virtuels
    duration: '10s', // durée totale du test
};

const BASE_URL = 'http://localhost:8000';

export default function () {
    // Créer d'abord un client pour pouvoir le supprimer
    let payload = JSON.stringify({
        nom: "Test",
        prenom: "K6",
        adresse: "123 Rue Exemple"
    });

    let headers = { 'Content-Type': 'application/json' };
    let resPost = http.post(`${BASE_URL}/api/v1/client/`, payload, { headers });
    const clientId = resPost.json().codcli;

    // DELETE client
    let resDelete = http.del(`${BASE_URL}/api/v1/client/${clientId}`);
    check(resDelete, {
        'DELETE /client/{id} status 200': (r) => r.status === 200,
    });

    sleep(1);
}
