from fastapi import APIRouter, Depends

from app.api.dependencies import get_health_service
from app.schemas.health import HealthResponse
from app.services.health_service import HealthService

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health_check(
    health_service: HealthService = Depends(get_health_service),
) -> HealthResponse:
    return health_service.get_health()
