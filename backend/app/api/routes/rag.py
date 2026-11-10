"""
RAG knowledge search API.

Provides read-only semantic search over approved
enterprise knowledge documents.
"""

from typing import Any

from fastapi import APIRouter, Depends, Query

from app.rag.service import search_knowledge
from app.security.dependencies import require_permission
from app.security.models import Permission


router = APIRouter(
    prefix="/rag",
    tags=["rag"],
)


@router.get(
    "/search",
    summary="Search approved knowledge",
    description=(
        "Perform semantic search over the approved "
        "knowledge base.\n\n"
        "This endpoint is read-only and does not allow "
        "modification of the vector store."
    ),
)
async def search_rag_knowledge(
    q: str = Query(
        ...,
        min_length=3,
        description=(
            "Natural-language search query for approved "
            "knowledge documents."
        ),
    ),
    limit: int = Query(
        5,
        ge=1,
        le=10,
        description=(
            "Maximum number of knowledge chunks to return."
        ),
    ),
    _user: Any = Depends(
        require_permission(
            Permission.RAG_READ
        )
    ),
):
    """
    Search approved knowledge and return clean evidence
    with stable citation identifiers.
    """

    evidence = search_knowledge(
        query=q,
        limit=limit,
    )

    return {
        "query": q,
        "result_count": len(evidence),
        "results": [
            {
                "citation_id": item.citation_id,
                "title": item.title,
                "document_type": item.document_type,
                "excerpt": item.excerpt,
                "relevance_score": (
                    item.relevance_score
                ),
                "document_id": item.document_id,
                "chunk_index": item.chunk_index,
            }
            for item in evidence
        ],
    }