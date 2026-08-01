from pydantic import BaseModel, ConfigDict, conint


class TrainForecastResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    trained_products: conint(strict=True, ge=0)
    skipped_products: list[conint(strict=True, gt=0)]
    models_saved: bool
