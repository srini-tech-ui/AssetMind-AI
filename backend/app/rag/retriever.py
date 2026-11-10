"""
RAG retrieval layer.

Responsible for retrieving raw ChromaDB results and converting them
into clean evidence objects.
"""

from app.rag.models import Evidence
from app.rag.store import search_documents


def _distance_to_relevance(distance: float) -> float:
    """
    Convert vector distance into a simple relevance score.

    ChromaDB distance is lower when documents are more similar.

    This is intentionally a simple transformation for the POC.
    It should not be interpreted as an LLM confidence score.
    """

    relevance = 1.0 / (1.0 + max(distance, 0.0))

    return round(relevance, 4)


def _create_excerpt(
    content: str,
    max_length: int = 500,
) -> str:
    """
    Create a readable excerpt without breaking words unnecessarily.
    """

    cleaned = " ".join(content.split())

    if len(cleaned) <= max_length:
        return cleaned

    excerpt = cleaned[:max_length]

    last_space = excerpt.rfind(" ")

    if last_space > 0:
        excerpt = excerpt[:last_space]

    return f"{excerpt}..."


def retrieve_evidence(
    query: str,
    limit: int = 5,
) -> list[Evidence]:
    """
    Perform semantic search and return clean evidence objects.

    This function is read-only.
    """

    raw_results = search_documents(
        query=query,
        limit=limit,
    )

    evidence_results: list[Evidence] = []

    for result in raw_results:
        metadata = result.get("metadata") or {}

        document_id = str(
            metadata.get(
                "document_id",
                "unknown",
            )
        )

        chunk_index = int(
            metadata.get(
                "chunk_index",
                0,
            )
        )

        distance = float(
            result.get(
                "distance",
                0.0,
            )
        )

        citation_id = (
            f"policy:{document_id}:"
            f"chunk-{chunk_index}"
        )

        evidence = Evidence(
            citation_id=citation_id,
            title=str(
                metadata.get(
                    "title",
                    "Untitled Document",
                )
            ),
            document_type=str(
                metadata.get(
                    "document_type",
                    "knowledge",
                )
            ),
            excerpt=_create_excerpt(
                str(
                    result.get(
                        "content",
                        "",
                    )
                )
            ),
            relevance_score=_distance_to_relevance(
                distance
            ),
            document_id=document_id,
            chunk_index=chunk_index,
        )

        evidence_results.append(
            evidence
        )

    return evidence_results