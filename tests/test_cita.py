
def test_obtener_citas(client):
    response = client.get("/api/citas/")
    assert response.status_code == 200
