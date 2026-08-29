"""
Pytest configuration and fixtures.

Configures pytest for async tests and provides common fixtures.
"""
import sys
from pathlib import Path

# Add backend root to Python path for imports
sys.path.insert(0, str(Path(__file__).parent))

import pytest
import pytest_asyncio


@pytest.fixture
def anyio_backend():
    """Configure async backend for pytest-asyncio."""
    return "asyncio"
