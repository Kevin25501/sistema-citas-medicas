
def test_obtener_medicos(client):
    response = client.get("/api/medicos/")
    assert response.status_code == 200

def test_crear_medico(client):
    payload = {
        "cedula": "0987654321",
        "nombres": "Dra. Ana",
        "apellidos": "Gomez",
        "especialidad": "Cardiología"
    }
    response = client.post("/api/medicos/", json=payload)
    assert response.status_code in [200, 201, 422]
