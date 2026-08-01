from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    service_name: str = Field(default="ai-service", validation_alias="SERVICE_NAME")
    service_version: str = Field(
        default="0.1.0",
        validation_alias="SERVICE_VERSION",
    )
    ollama_base_url: str | None = Field(
        default=None,
        validation_alias="OLLAMA_BASE_URL",
    )
    ollama_model: str | None = Field(default=None, validation_alias="OLLAMA_MODEL")
    ollama_timeout_seconds: float = Field(
        default=90.0,
        validation_alias="OLLAMA_TIMEOUT_SECONDS",
    )
    rails_api_url: str | None = Field(default=None, validation_alias="RAILS_API_URL")
    rails_api_token: str | None = Field(default=None, validation_alias="RAILS_API_TOKEN")
    forecast_models_dir: str = Field(default="models", validation_alias="FORECAST_MODELS_DIR")
    forecast_reorder_lead_time_days: int = Field(
        default=3,
        ge=0,
        validation_alias="FORECAST_REORDER_LEAD_TIME_DAYS",
    )
    forecast_reorder_safety_stock_percentage: float = Field(
        default=20,
        ge=0,
        validation_alias="FORECAST_REORDER_SAFETY_STOCK_PERCENTAGE",
    )

    @field_validator("ollama_base_url", "ollama_model", "rails_api_url", "rails_api_token", mode="before")
    @classmethod
    def empty_string_to_none(cls, value: str | None) -> str | None:
        if value == "":
            return None
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
