"""
Knowledge document loading utilities.

Loads approved knowledge documents from the local
knowledge directory for RAG ingestion.
"""

from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[3]

KNOWLEDGE_DIR = (
    BASE_DIR
    / "data"
    / "knowledge"
)


def load_markdown_documents() -> list[dict]:
    """
    Load all Markdown documents from the knowledge directory.

    Returns documents with basic metadata required
    for RAG ingestion.
    """

    documents: list[dict] = []

    if not KNOWLEDGE_DIR.exists():
        return documents

    for file_path in KNOWLEDGE_DIR.glob("*.md"):

        content = file_path.read_text(
            encoding="utf-8"
        ).strip()

        if not content:
            continue

        documents.append(
            {
                "id": file_path.stem,
                "title": file_path.stem.replace(
                    "_",
                    " "
                ).title(),
                "source": str(file_path.name),
                "content": content,
                "document_type": "policy",
            }
        )

    return documents