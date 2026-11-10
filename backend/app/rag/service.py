"""
RAG application service.

Provides the API-friendly interface to approved knowledge retrieval.
"""

from app.rag.models import Evidence
from app.rag.retriever import retrieve_evidence


def search_knowledge(
    query: str,
    limit: int = 5,
) -> list[Evidence]:
    """
    Search approved enterprise knowledge.

    This is intentionally read-only.
    """

    return retrieve_evidence(
        query=query,
        limit=limit,
    )