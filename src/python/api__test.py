import pytest
from api import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_status(client):
    response = client.get("/status")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert data["response"] == "running"

# should respond with a non empty string, it's an LLM response
def test_talk(client):
    response = client.post("/talk", json={"name": "Madeleine Rousseau", "topic": "Weather"})
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert data["response"] != ""

def test_interrogate(client):
    response = client.post("/interrogate", json={"name": "Madeleine Rousseau", "topic": "Weather"})
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert data["response"] != ""

def test_rooms(client):
    response = client.get("/rooms")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert isinstance(data["rooms"], list)
    assert len(data["rooms"]) > 0
    assert data["rooms"][0]["name"] == "Study"