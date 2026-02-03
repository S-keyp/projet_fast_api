# test_app.py
import pytest
from fastapi.testclient import TestClient
from app import app
client = TestClient(app)
# --------------------------
# Test route racine
# --------------------------
def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "FastAPI operational"}
# --------------------------
# Test création et lecture client
# --------------------------
def test_create_and_get_client():
    client_data = {
        "nom": "Dupont",
        "prenom": "Jean",
        "adresse": "123 Rue Exemple"
    }
    # Création
    response = client.post("/api/v1/client/", json=client_data)
    assert response.status_code == 200
    created = response.json()
    assert created["nom"] == "Dupont"
    assert created["prenom"] == "Jean"
    client_id = created["codcli"]
    # Lecture
    response_get = client.get(f"/api/v1/client/{client_id}")
    assert response_get.status_code == 200
    fetched = response_get.json()
    assert fetched["nom"] == "Dupont"
    assert fetched["prenom"] == "Jean"
# --------------------------
# Test patch client
# --------------------------
def test_patch_client():
    client_data = {
        "nom": "Martin",
        "prenom": "Paul",
        "adresse": "456 Rue Exemple"
    }
    # Création
    response = client.post("/api/v1/client/", json=client_data)
    created = response.json()
    client_id = created["codcli"]
    # Patch
    patch_data = {"prenom": "Pierre"}
    response_patch = client.patch(f"/api/v1/client/{client_id}", json=patch_data)
    assert response_patch.status_code == 200
    updated = response_patch.json()
    assert updated["prenom"] == "Pierre"

    # --------------------------
    # Test suppression client
    # --------------------------
def test_delete_client():
    client_data = {
        "nom": "Leroy",
        "prenom": "Sophie",
        "adresse": "789 Rue Exemple"
    }
    # Création
    response = client.post("/api/v1/client/", json=client_data)
    created = response.json()
    client_id = created["codcli"]
    # Suppression
    response_delete = client.delete(f"/api/v1/client/{client_id}")
    assert response_delete.status_code == 200
    deleted = response_delete.json()
    assert deleted["codcli"] == client_id
    # Vérifier que le client n'existe plus
    response_get = client.get(f"/api/v1/client/{client_id}")
    assert response_get.status_code == 404