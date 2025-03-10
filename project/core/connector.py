from typing import Any, Callable
from loguru import logger

class Connector:
    def __init__(self, source_module: str, target_module: str):
        self.source = source_module
        self.target = target_module
        self.validators: list[Callable] = []
        logger.info(f"Connector created between {source_module} and {target_module}")

    def add_validator(self, validator: Callable[[Any], bool]):
        self.validators.append(validator)
        logger.debug(f"Validator added to connector {self.source}->{self.target}")

    def validate_data(self, data: Any) -> bool:
        for validator in self.validators:
            try:
                if not validator(data):
                    logger.warning(f"Validation failed for {self.source}->{self.target}")
                    return False
            except Exception as e:
                logger.error(f"Validator error: {e}")
                return False
        return True

    def transfer_data(self, data: Any) -> bool:
        if self.validate_data(data):
            logger.info(f"Data transferred from {self.source} to {self.target}")
            return True
        return False
