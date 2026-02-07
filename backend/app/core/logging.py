import logging
from typing import Optional

from app.core.config import settings


def configure_logging(level: Optional[str] = None) -> None:
    logging.basicConfig(
        level=(level or settings.log_level).upper(),
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )
