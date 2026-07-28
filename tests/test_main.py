
def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "mensaje" in data
    assert data["version"] == "1.0.0"
