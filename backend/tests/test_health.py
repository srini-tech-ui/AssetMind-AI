"""
Tests for health check endpoints.

Validates that the FastAPI application starts and responds to health checks.
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """Fixture providing FastAPI TestClient."""
    return TestClient(app)


def test_health_check_liveness(client):
    """Test GET /health returns 200 OK."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "service" in data
    assert "version" in data


def test_health_check_has_correlation_id(client):
    """Test that health endpoint returns correlation ID header."""
    response = client.get("/health")
    assert "x-correlation-id" in response.headers


def test_health_check_readiness(client):
    """Test GET /api/v1/health/readiness returns 200 OK."""
    response = client.get("/api/v1/health/readiness")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"


def test_correlation_id_header_preserved(client):
    """Test that custom correlation ID is preserved in response."""
    custom_id = "test-correlation-123"
    response = client.get("/health", headers={"X-Correlation-ID": custom_id})
    assert response.headers["x-correlation-id"] == custom_id


def test_correlation_id_generated_if_missing(client):
    """Test that correlation ID is generated if not provided."""
    response = client.get("/health")
    correlation_id = response.headers.get("x-correlation-id")
    assert correlation_id is not None
    assert len(correlation_id) > 0


def test_api_v1_health_endpoint(client):
    """Test GET /api/v1/health exists."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
