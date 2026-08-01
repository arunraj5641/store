from typing import Any

import httpx

from app.core.config import Settings


class RailsSalesHistoryClientError(Exception):
    def __init__(self, message: str, status_code: int = 502) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class RailsSalesHistoryClient:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    async def fetch_all(self, authorization_header: str | None = None) -> list[dict[str, Any]]:
        if not self._settings.rails_api_url:
            raise RailsSalesHistoryClientError("RAILS_API_URL is not configured.", 424)

        return await self._fetch_paginated(
            url=self._sales_history_url(),
            authorization_header=authorization_header,
        )

    async def fetch_product(
        self,
        product_id: int,
        authorization_header: str | None = None,
    ) -> list[dict[str, Any]]:
        if not self._settings.rails_api_url:
            raise RailsSalesHistoryClientError("RAILS_API_URL is not configured.", 424)

        return await self._fetch_paginated(
            url=self._product_sales_history_url(product_id),
            authorization_header=authorization_header,
        )

    async def _fetch_paginated(
        self,
        url: str,
        authorization_header: str | None = None,
    ) -> list[dict[str, Any]]:
        sales_history: list[dict[str, Any]] = []
        page = 1

        async with httpx.AsyncClient(timeout=30.0) as client:
            while True:
                response = await client.get(
                    url,
                    params={"page": page, "per_page": 100},
                    headers=self._headers(authorization_header),
                )
                self._raise_for_error(response)
                payload = self._parse_response(response)

                sales_history.extend(payload.get("data", {}).get("sales_histories", []))
                meta = payload.get("meta") or {}
                total_pages = int(meta.get("total_pages") or 1)

                if page >= total_pages:
                    break

                page += 1

        return sales_history

    def _sales_history_url(self) -> str:
        return self._api_path("sales_histories")

    def _product_sales_history_url(self, product_id: int) -> str:
        return self._api_path(f"products/{product_id}/sales_history")

    def _api_path(self, path: str) -> str:
        base_url = self._settings.rails_api_url.rstrip("/")

        if base_url.endswith("/api/v1"):
            return f"{base_url}/{path}"

        if base_url.endswith("/api"):
            return f"{base_url}/v1/{path}"

        return f"{base_url}/api/v1/{path}"

    def _headers(self, authorization_header: str | None) -> dict[str, str]:
        if authorization_header:
            return {"Authorization": authorization_header}

        if self._settings.rails_api_token:
            return {"Authorization": f"Bearer {self._settings.rails_api_token}"}

        return {}

    def _raise_for_error(self, response: httpx.Response) -> None:
        if response.is_success:
            return

        if response.status_code in {401, 403}:
            raise RailsSalesHistoryClientError(
                "Rails API rejected the sales history request.",
                response.status_code,
            )

        raise RailsSalesHistoryClientError("Unable to fetch sales history from Rails API.")

    def _parse_response(self, response: httpx.Response) -> dict[str, Any]:
        try:
            payload = response.json()
        except ValueError as error:
            raise RailsSalesHistoryClientError("Rails API returned invalid JSON.") from error

        if not isinstance(payload, dict):
            raise RailsSalesHistoryClientError("Rails API returned an invalid response.")

        return payload
