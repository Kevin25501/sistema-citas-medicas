import requests

url = "http://localhost:8000/api/usuarios/registro"
datos = {
    "username": "kevin",
    "password": "123456",
    "perfil_id": 1
}

print("📡 Enviando solicitud al backend...")
r = requests.post(url, json=datos)

print("Estado:", r.status_code)
print("Respuesta:", r.json())