"""
Document chunking utilities.

Splits knowledge documents into manageable chunks
before they are stored in the vector database.
"""


def chunk_text(
    text: str,
    chunk_size: int = 800,
    overlap: int = 150,
) -> list[str]:
    """
    Split text into overlapping chunks.

    The initial implementation uses character-based
    chunking for simplicity and predictable behavior.
    """

    text = text.strip()

    if not text:
        return []

    chunks: list[str] = []

    start = 0
    text_length = len(text)

    while start < text_length:

        end = min(
            start + chunk_size,
            text_length,
        )

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end >= text_length:
            break

        start = end - overlap

    return chunks