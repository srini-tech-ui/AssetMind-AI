"""
Knowledge document ingestion for the local RAG store.

Reads supported documents from backend/data/knowledge,
chunks them at paragraph and sentence boundaries,
and stores them in ChromaDB.
"""

from pathlib import Path

from app.rag.store import add_documents


# -------------------------------------------------
# PROJECT PATHS
# -------------------------------------------------

# Current file:
# backend/app/rag/ingest.py
#
# parents[0] = rag
# parents[1] = app
# parents[2] = backend

BACKEND_DIR = Path(__file__).resolve().parents[2]

KNOWLEDGE_DIR = BACKEND_DIR / "data" / "knowledge"


# -------------------------------------------------
# CHUNKING
# -------------------------------------------------

CHUNK_SIZE = 800
CHUNK_OVERLAP = 100


def _find_break_point(
    text: str,
    start: int,
    max_end: int,
) -> int:
    """
    Find a natural chunk boundary.

    Preference order:
    1. Paragraph boundary
    2. Sentence boundary
    3. Whitespace boundary
    4. Hard character limit
    """

    if max_end >= len(text):
        return len(text)

    # ---------------------------------------------
    # Prefer paragraph boundaries
    # ---------------------------------------------

    paragraph_break = text.rfind(
        "\n\n",
        start,
        max_end,
    )

    if paragraph_break > start:
        return paragraph_break + 2

    # ---------------------------------------------
    # Prefer sentence boundaries
    # ---------------------------------------------

    sentence_breaks = [
        text.rfind(". ", start, max_end),
        text.rfind("! ", start, max_end),
        text.rfind("? ", start, max_end),
        text.rfind(".\n", start, max_end),
        text.rfind("!\n", start, max_end),
        text.rfind("?\n", start, max_end),
    ]

    sentence_break = max(sentence_breaks)

    if sentence_break > start:
        return sentence_break + 2

    # ---------------------------------------------
    # Fall back to whitespace
    # ---------------------------------------------

    whitespace_break = text.rfind(
        " ",
        start,
        max_end,
    )

    if whitespace_break > start:
        return whitespace_break + 1

    # ---------------------------------------------
    # Final fallback
    # ---------------------------------------------

    return max_end


def chunk_text(
    text: str,
    chunk_size: int = CHUNK_SIZE,
    overlap: int = CHUNK_OVERLAP,
) -> list[str]:
    """
    Split text into overlapping chunks.

    Chunks prefer paragraph and sentence boundaries
    so words are not cut in the middle.

    The overlap preserves context between adjacent
    chunks while attempting to start the next chunk
    at a natural whitespace boundary.
    """

    text = text.strip()

    if not text:
        return []

    chunks: list[str] = []

    start = 0
    text_length = len(text)

    while start < text_length:

        max_end = min(
            start + chunk_size,
            text_length,
        )

        end = _find_break_point(
            text=text,
            start=start,
            max_end=max_end,
        )

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        # End of document
        if end >= text_length:
            break

        # -----------------------------------------
        # Calculate overlap position
        # -----------------------------------------

        next_start = max(
            end - overlap,
            start + 1,
        )

        # Move forward to a whitespace boundary.
        # This prevents the next chunk from starting
        # in the middle of a word.
        while (
            next_start < text_length
            and not text[next_start].isspace()
        ):
            next_start += 1

        # Skip whitespace.
        while (
            next_start < text_length
            and text[next_start].isspace()
        ):
            next_start += 1

        # Safety check to guarantee forward progress.
        if next_start <= start:
            next_start = end

        start = next_start

    return chunks


# -------------------------------------------------
# DOCUMENT INGESTION
# -------------------------------------------------

def ingest_document(file_path: Path) -> int:
    """
    Read one Markdown document and add its chunks
    to ChromaDB.
    """

    content = file_path.read_text(
        encoding="utf-8"
    )

    chunks = chunk_text(content)

    if not chunks:

        print(
            f"Skipping empty document: "
            f"{file_path.name}"
        )

        return 0

    document_id = file_path.stem

    ids: list[str] = []
    documents: list[str] = []
    metadatas: list[dict] = []

    for index, chunk in enumerate(chunks):

        chunk_id = (
            f"{document_id}-chunk-{index}"
        )

        ids.append(chunk_id)

        documents.append(chunk)

        metadatas.append(
            {
                "document_id": document_id,
                "title": file_path.stem.replace(
                    "_",
                    " "
                ).title(),
                "source": str(file_path),
                "document_type": "policy",
                "chunk_index": index,
            }
        )

    add_documents(
        ids=ids,
        documents=documents,
        metadatas=metadatas,
    )

    return len(chunks)


# -------------------------------------------------
# INGEST ALL KNOWLEDGE DOCUMENTS
# -------------------------------------------------

def ingest_all() -> None:
    """
    Ingest all supported knowledge documents.
    """

    print(
        "Knowledge directory:",
        KNOWLEDGE_DIR,
    )

    if not KNOWLEDGE_DIR.exists():

        print(
            "Knowledge directory does not exist:"
        )

        print(KNOWLEDGE_DIR)

        return

    markdown_files = list(
        KNOWLEDGE_DIR.glob("*.md")
    )

    if not markdown_files:

        print(
            "No knowledge documents found."
        )

        return

    total_chunks = 0

    for file_path in markdown_files:

        print(
            f"Ingesting: {file_path.name}"
        )

        chunk_count = ingest_document(
            file_path
        )

        total_chunks += chunk_count

        print(
            f"Added {chunk_count} chunks"
        )

    print()

    print(
        "Ingestion complete."
    )

    print(
        f"Documents processed: "
        f"{len(markdown_files)}"
    )

    print(
        f"Chunks added: "
        f"{total_chunks}"
    )


# -------------------------------------------------
# ENTRY POINT
# -------------------------------------------------

if __name__ == "__main__":

    ingest_all()