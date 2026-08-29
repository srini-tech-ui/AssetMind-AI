"""
Application configuration using Pydantic Settings.

Environment variables are read from .env file or system environment.
No secrets should be hardcoded here.
"""
from functools import lru_cache
from typing import Literal

from pydantic import ConfigDict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    model_config = ConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)

    # Application metadata
    app_name: str = "AI Asset Intelligence Backend"
    app_env: Literal["development", "staging", "production"] = "development"
    app_version: str = "0.1.0"

    # Server configuration
    host: str = "127.0.0.1"
    port: int = 8000
    reload: bool = True

    # API configuration
    api_prefix: str = "/api/v1"
    api_title: str = "AI Asset Intelligence"

    # Database configuration
    database_url: str = (
        "postgresql+asyncpg://asset_admin:CHANGE_ME@localhost:5432/asset_intelligence"
    )

    # CORS configuration
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:8080"]
    cors_allow_credentials: bool = True
    cors_allow_methods: list[str] = ["*"]
    cors_allow_headers: list[str] = ["*"]

    # Logging configuration
    log_level: str = "INFO"

    # Request/Response configuration
    correlation_id_header: str = "X-Correlation-ID"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
