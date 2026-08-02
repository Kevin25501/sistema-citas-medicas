import requests

url = "https://sistema-citas-medicas-k58b.onrender.com/api/usuarios/registro"
datos = {
    "username": "kevin",
    "password": "123456",
    "nombre": "Kevin Test",
    "perfil_id": 1
}

print("📡 Enviando solicitud al backend...")
respuesta = requests.post(url, json=datos)

print(f"Estado: {respuesta.status_code}")
print("Respuesta del servidor:", respuesta.json())