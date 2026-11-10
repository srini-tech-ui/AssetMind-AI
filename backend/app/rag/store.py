"""
ChromaDB vector store for AI Asset Intelligence knowledge.

This module provides a local persistent vector store for
enterprise policies, procedures, lifecycle documentation,
vendor notices, and other approved knowledge sources.

Development / POC implementation.
"""

from pathlib import Path

import chromadb


# ============================================
# PROJECT PATHS
# ============================================

BASE_DIR = Path(__file__).resolve().parents[3]

CHROMA_DATA_DIR = (
    BASE_DIR
    / "data"
    / "chroma"
)


# ============================================
# CHROMADB CLIENT
# ============================================

_client = chromadb.PersistentClient(
    path=str(CHROMA_DATA_DIR)
)


# ============================================
# KNOWLEDGE COLLECTION
# ============================================

_collection = _client.get_or_create_collection(
    name="asset_knowledge"
)


# ============================================
# ADD / UPDATE DOCUMENTS
# ============================================

def add_documents(
    ids: list[str],
    documents: list[str],
    metadatas: list[dict],
) -> None:
    """
    Add or update knowledge documents in ChromaDB.

    ChromaDB generates embeddings automatically for
    query and document text in this initial POC.
    """

    _collection.upsert(
        ids=ids,
        documents=documents,
        metadatas=metadatas,
    )


# ============================================
# SEARCH DOCUMENTS
# ============================================

def search_documents(
    query: str,
    limit: int = 5,
) -> list[dict]:
    """
    Search the knowledge base using semantic similarity.

    Returns relevant document chunks with metadata
    and vector distance.
    """

    result = _collection.query(
        query_texts=[query],
        n_results=limit,
    )

    documents = (
        result.get("documents", [[]])[0]
    )

    metadatas = (
        result.get("metadatas", [[]])[0]
    )

    distances = (
        result.get("distances", [[]])[0]
    )

    return [
        {
            "content": document,
            "metadata": metadata,
            "distance": distance,
        }
        for document, metadata, distance
        in zip(
            documents,
            metadatas,
            distances,
        )
    ]


# ============================================
# COLLECTION INFORMATION
# ============================================

def get_document_count() -> int:
    """
    Return the number of indexed documents.
    """

    return _collection.count()


# ============================================
# DELETE DOCUMENT
# ============================================

def delete_document(
    document_id: str,
) -> None:
    """
    Delete a document from the knowledge base.

    This function is intentionally explicit and only
    deletes a specific document ID.
    """

    _collection.delete(
        ids=[document_id]
    )