from fastapi import FastAPI
from loguru import logger
from pydantic import BaseModel

app = FastAPI(title="L.O.N.G.I.N Core System")

class ModuleRegistration(BaseModel):
    module_id: str
    module_type: str
    level: int
    dependencies: list[str]

class EventMessage(BaseModel):
    source: str
    target: str
    event_type: str
    payload: dict

@app.post("/register_module")
async def register_module(module: ModuleRegistration):
    logger.info(f"Registering module: {module.module_id}")
    return {"status": "success", "message": f"Module {module.module_id} registered"}

@app.post("/event")
async def handle_event(event: EventMessage):
    logger.info(f"Event received from {event.source} to {event.target}")
    return {"status": "success", "event_id": "generated_id"}
