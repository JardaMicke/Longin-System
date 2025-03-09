from fastapi import FastAPI, HTTPException
from loguru import logger
from pydantic import BaseModel

# Add to existing imports
class LogEntry(BaseModel):
    message: str
    stack: str | None = None
    context: str | None = None
    timestamp: str
    type: str

@app.post("/log")
async def log_error(entry: LogEntry):
    logger.error(f"{entry.type} - {entry.message}\nContext: {entry.context}\nStack: {entry.stack}")
    return {"status": "logged"}

@app.get("/api/test-success")
async def test_success():
    return {"message": "Success test passed"}

@app.get("/api/test-error")
async def test_error():
    try:
        1 / 0
    except Exception as e:
        logger.error("Test error triggered: {}", e)
        raise HTTPException(status_code=500, detail="Intentional test error")
