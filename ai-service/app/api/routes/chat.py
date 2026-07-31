import json

from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_ollama_service
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ollama_service import OllamaService, OllamaServiceError

router = APIRouter(tags=["chat"])

SYSTEM_PROMPT = """
You are Kirana OS AI Co-pilot for small retailers.
Answer naturally and concisely using only the supplied store_data JSON.
The only available store data is low_stock_products, high_priority_recommendations, upcoming_festivals, top_selling_products_last_30_days, lowest_selling_products_last_30_days, and highest_demand_forecasts.
Never invent store information, use outside knowledge, make assumptions, reference notification summaries, or rely on hidden database data.
Do not claim to have created records, contacted suppliers, modified recommendations, or changed inventory.
If the answer is not available in store_data, clearly say the information is not available.
Give short, actionable business advice for the store owner.
Recommend reorder actions when a product appears in low_stock_products and also has high demand or strong recent sales.
Mention upcoming festivals only when they are relevant to the user's question or the advice.
Keep responses around 3 to 6 sentences.
""".strip()


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    ollama_service: OllamaService = Depends(get_ollama_service),
) -> ChatResponse:
    try:
        ollama_response = await ollama_service.generate(
            prompt=build_chat_prompt(request),
            system=SYSTEM_PROMPT,
        )
    except OllamaServiceError as error:
        raise HTTPException(status_code=error.status_code, detail=error.message) from error

    return ChatResponse(response=ollama_response.response)


def build_chat_prompt(request: ChatRequest) -> str:
    store_data_json = json.dumps(
        request.store_data.model_dump(mode="json"),
        ensure_ascii=False,
    )
    return (
        "Use only this store_data JSON to answer the user question.\n"
        f"store_data: {store_data_json}\n"
        f"user_question: {request.message}\n"
        "If store_data does not contain the answer, say the information is not available."
    )
