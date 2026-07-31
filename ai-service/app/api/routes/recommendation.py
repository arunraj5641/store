import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import ValidationError

from app.api.dependencies import get_ollama_service
from app.schemas.recommendation import (
    GenerateRecommendationRequest,
    GenerateRecommendationResponse,
)
from app.services.ollama_service import OllamaService, OllamaServiceError

router = APIRouter(tags=["recommendations"])

SYSTEM_PROMPT = """
You are a professional inventory management assistant for a kirana store.
Analyze current stock, forecast demand, recent sales trend, and the upcoming festival.
Recommend the additional stock quantity the store should purchase, not total inventory.
Return only a valid JSON object with exactly these keys:
recommended_quantity: integer greater than or equal to 0.
priority: one of "low", "medium", "high", or "urgent".
reason: one concise business reason.
Never return markdown, code fences, comments, or explanations.
""".strip()


@router.post("/generate-recommendation", response_model=GenerateRecommendationResponse)
async def generate_recommendation(
    request: GenerateRecommendationRequest,
    ollama_service: OllamaService = Depends(get_ollama_service),
) -> GenerateRecommendationResponse:
    try:
        ollama_response = await ollama_service.generate(
            prompt=build_recommendation_prompt(request),
            system=SYSTEM_PROMPT,
            response_format="json",
        )
    except OllamaServiceError as error:
        raise HTTPException(status_code=error.status_code, detail=error.message) from error

    try:
        parsed_response = json.loads(ollama_response.response)
    except json.JSONDecodeError as error:
        raise HTTPException(status_code=502, detail="AI returned invalid JSON.") from error

    try:
        return GenerateRecommendationResponse.model_validate(parsed_response)
    except ValidationError as error:
        raise HTTPException(
            status_code=502,
            detail={
                "message": "AI response failed recommendation validation.",
                "errors": error.errors(),
            },
        ) from error


def build_recommendation_prompt(request: GenerateRecommendationRequest) -> str:
    context_json = request.model_dump_json()
    return (
        "Use this structured store data to generate one replenishment recommendation.\n"
        f"{context_json}\n"
        "Return only the JSON object."
    )
