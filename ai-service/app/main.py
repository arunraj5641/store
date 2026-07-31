from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import Settings, get_settings


def create_app(settings: Settings | None = None) -> FastAPI:
    app_settings = settings or get_settings()
    application = FastAPI(
        title=app_settings.service_name,
        version=app_settings.service_version,
    )
    application.include_router(api_router)
    return application


app = create_app()
