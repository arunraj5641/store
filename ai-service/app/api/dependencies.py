from fastapi import Depends

from app.core.config import Settings, get_settings
from app.services.health_service import HealthService
from app.services.ollama_service import OllamaService


def get_health_service(settings: Settings = Depends(get_settings)) -> HealthService:
    return HealthService(settings=settings)


def get_ollama_service(settings: Settings = Depends(get_settings)) -> OllamaService:
    return OllamaService(settings=settings)
