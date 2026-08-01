from fastapi import Depends

from app.core.config import Settings, get_settings
from app.forecasting.predictor import ForecastPredictionService
from app.forecasting.rails_client import RailsSalesHistoryClient
from app.forecasting.trainer import ForecastTrainingService
from app.services.health_service import HealthService
from app.services.ollama_service import OllamaService


def get_health_service(settings: Settings = Depends(get_settings)) -> HealthService:
    return HealthService(settings=settings)


def get_ollama_service(settings: Settings = Depends(get_settings)) -> OllamaService:
    return OllamaService(settings=settings)


def get_forecast_training_service(
    settings: Settings = Depends(get_settings),
) -> ForecastTrainingService:
    return ForecastTrainingService(
        settings=settings,
        sales_history_client=RailsSalesHistoryClient(settings=settings),
    )


def get_forecast_prediction_service(
    settings: Settings = Depends(get_settings),
) -> ForecastPredictionService:
    return ForecastPredictionService(
        settings=settings,
        sales_history_client=RailsSalesHistoryClient(settings=settings),
    )
