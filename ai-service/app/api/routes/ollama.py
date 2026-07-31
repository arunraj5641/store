from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_ollama_service
from app.schemas.ollama import TestOllamaRequest, TestOllamaResponse
from app.services.ollama_service import OllamaService, OllamaServiceError

router = APIRouter(tags=["ollama"])


@router.post("/test-ollama", response_model=TestOllamaResponse)
async def test_ollama(
    request: TestOllamaRequest,
    ollama_service: OllamaService = Depends(get_ollama_service),
) -> TestOllamaResponse:
    try:
        return await ollama_service.generate(prompt=request.prompt)
    except OllamaServiceError as error:
        raise HTTPException(status_code=error.status_code, detail=error.message) from error
