"""
RAG domain models.

These models provide a clean boundary between the vector store
and the API/AI layers.
"""

from dataclasses import dataclass
from typing import Any


@dataclass
class KnowledgeDocument:
    """
    Represents an approved knowledge document before ingestion.
    """

    id: str
    title: str
    source: str
    content: str
    document_type: str
    version: str | None = None
    effective_date: str | None = None
    allowed_roles: list[str] | None = None


@dataclass
class RetrievedChunk:
    """
    Raw chunk returned from the vector store.
    """

    document_id: str
    title: str
    source: str
    content: str
    score: float
    metadata: dict[str, Any]


@dataclass
class Evidence:
    """
    Clean evidence object used by API and future AI services.

    The source file path is intentionally not exposed.
    """

    citation_id: str
    title: str
    document_type: str
    excerpt: str
    relevance_score: float
    document_id: str
    chunk_index: int