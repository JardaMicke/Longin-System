from typing import Dict, List, Callable
from loguru import logger

class EventBus:
    def __init__(self):
        self._subscribers: Dict[str, List[Callable]] = {}
        logger.info("EventBus initialized")

    def subscribe(self, event_type: str, callback: Callable):
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        self._subscribers[event_type].append(callback)
        logger.debug(f"Subscribed to event: {event_type}")

    def publish(self, event_type: str, data: dict):
        if event_type in self._subscribers:
            for callback in self._subscribers[event_type]:
                try:
                    callback(data)
                except Exception as e:
                    logger.error(f"Error in event handler: {e}")
        logger.debug(f"Published event: {event_type}")
