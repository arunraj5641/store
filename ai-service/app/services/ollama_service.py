from typing import Any

import httpx

from app.core.config import Settings
from app.schemas.ollama import TestOllamaResponse


class OllamaServiceError(Exception):
    def __init__(self, message: str, status_code: int) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class OllamaUnavailableError(OllamaServiceError):
    def __init__(self) -> None:
        super().__init__("Ollama is unavailable.", 503)


class OllamaTimeoutError(OllamaServiceError):
    def __init__(self) -> None:
        super().__init__("Timed out while waiting for Ollama.", 504)


class MissingOllamaModelError(OllamaServiceError):
    def __init__(self, model: str | None = None) -> None:
        if model:
            message = (
                f"Ollama model '{model}' is not available. Pull it with: "
                f"docker compose exec ollama ollama pull {model}"
            )
        else:
            message = "OLLAMA_MODEL is not configured."
        super().__init__(message, 424)


class InvalidOllamaResponseError(OllamaServiceError):
    def __init__(self) -> None:
        super().__init__("Ollama returned an invalid response.", 502)


class OllamaRequestError(OllamaServiceError):
    def __init__(self, message: str) -> None:
        super().__init__(message, 502)


class OllamaService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    async def generate(
        self,
        prompt: str,
        system: str | None = None,
        response_format: str | None = None,
    ) -> TestOllamaResponse:
        if not self._settings.ollama_base_url:
            raise OllamaUnavailableError()

        if not self._settings.ollama_model:
            raise MissingOllamaModelError()

        payload = {
            "model": self._settings.ollama_model,
            "prompt": prompt,
            "stream": False,
        }
        if system:
            payload["system"] = system
        if response_format:
            payload["format"] = response_format

        try:
            async with httpx.AsyncClient(
                base_url=self._settings.ollama_base_url,
                timeout=self._settings.ollama_timeout_seconds,
            ) as client:
                response = await client.post("/api/generate", json=payload)
        except httpx.TimeoutException as error:
            raise OllamaTimeoutError() from error
        except httpx.RequestError as error:
            raise OllamaUnavailableError() from error

        self._raise_for_ollama_error(response)

        try:
            data = response.json()
        except ValueError as error:
            raise InvalidOllamaResponseError() from error

        text = data.get("response")
        if not isinstance(text, str):
            raise InvalidOllamaResponseError()

        return TestOllamaResponse(success=True, response=text.strip())

    def _raise_for_ollama_error(self, response: httpx.Response) -> None:
        if response.is_success:
            return

        error_message = self._extract_error_message(response)
        normalized_error = error_message.lower()

        if response.status_code == 404 and "model" in normalized_error:
            raise MissingOllamaModelError(self._settings.ollama_model)

        if response.status_code >= 500:
            raise OllamaUnavailableError()

        raise OllamaRequestError(error_message)

    def _extract_error_message(self, response: httpx.Response) -> str:
        try:
            data: Any = response.json()
        except ValueError:
            return "Ollama returned an error."

        if isinstance(data, dict) and isinstance(data.get("error"), str):
            return data["error"]

        return "Ollama returned an error."
