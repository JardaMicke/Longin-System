from loguru import logger

logger.add("logs/longin.log", rotation="500 MB", retention="10 days")
