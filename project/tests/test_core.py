import pytest
from fastapi.testclient import TestClient
from core.main import app
from core.event_bus import EventBus

client = TestClient(app)

def test_module_registration():
    response = client.post(
        "/register_module",
        json={
            "module_id": "test_module",
            "module_type": "test",
            "level": 1,
            "dependencies": []
        }
    )
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_event_bus():
    event_bus = EventBus()
    received_data = None

    def test_callback(data):
        nonlocal received_data
        received_data = data

    event_bus.subscribe("test_event", test_callback)
    test_data = {"message": "test"}
    event_bus.publish("test_event", test_data)

    assert received_data == test_data

def test_connector():
    from core.connector import Connector
    
    connector = Connector("source_module", "target_module")
    
    def validate_number(data: int) -> bool:
        return isinstance(data, int) and data > 0
    
    connector.add_validator(validate_number)
    
    assert connector.transfer_data(42) == True
    assert connector.transfer_data(-1) == False
    assert connector.transfer_data("not a number") == False
