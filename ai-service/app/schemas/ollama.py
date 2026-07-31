from typing import Literal

from pydantic import BaseModel, Field


class TestOllamaRequest(BaseModel):
    prompt: str = Field(min_length=1)


class TestOllamaResponse(BaseModel):
    success: Literal[True]
    response: str
