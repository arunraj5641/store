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
        default=30.0,
        validation_alias="OLLAMA_TIMEOUT_SECONDS",
    )
    rails_api_url: str | None = Field(default=None, validation_alias="RAILS_API_URL")

    @field_validator("ollama_base_url", "ollama_model", "rails_api_url", mode="before")
    @classmethod
    def empty_string_to_none(cls, value: str | None) -> str | None:
        if value == "":
            return None
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
