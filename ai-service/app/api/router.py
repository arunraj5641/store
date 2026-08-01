from fastapi import APIRouter

from app.api.routes.chat import router as chat_router
from app.api.routes.forecast import router as forecast_router
from app.api.routes.health import router as health_router
from app.api.routes.ollama import router as ollama_router
from app.api.routes.recommendation import router as recommendation_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(chat_router)
api_router.include_router(ollama_router)
api_router.include_router(recommendation_router)
api_router.include_router(forecast_router)
