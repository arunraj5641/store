from fastapi import APIRouter, Depends, Header, HTTPException

from app.api.dependencies import (
    get_forecast_prediction_service,
    get_forecast_training_service,
)
from app.forecasting.predictor import ForecastPredictionError, ForecastPredictionService
from app.forecasting.trainer import ForecastTrainingError, ForecastTrainingService
from app.schemas.forecast_prediction import ProductForecastResponse
from app.schemas.forecast_training import TrainForecastResponse

router = APIRouter(tags=["forecasting"])


@router.post("/forecast/train", response_model=TrainForecastResponse)
async def train_forecast_models(
    authorization: str | None = Header(default=None),
    training_service: ForecastTrainingService = Depends(get_forecast_training_service),
) -> TrainForecastResponse:
    try:
        return await training_service.train(authorization_header=authorization)
    except ForecastTrainingError as error:
        raise HTTPException(status_code=error.status_code, detail=error.message) from error


@router.post("/forecast/product/{product_id}", response_model=ProductForecastResponse)
async def predict_product_forecast(
    product_id: int,
    authorization: str | None = Header(default=None),
    prediction_service: ForecastPredictionService = Depends(get_forecast_prediction_service),
) -> ProductForecastResponse:
    try:
        return await prediction_service.predict(
            product_id=product_id,
            authorization_header=authorization,
        )
    except ForecastPredictionError as error:
        raise HTTPException(status_code=error.status_code, detail=error.message) from error
