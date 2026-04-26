from google.genai import types
from clients import model, sb
from models import AnimeInsert
from instructions import system_instructions


def embed_texts(texts: list[str]) -> list:
    response = model.models.embed_content(
        model="gemini-embedding-001",
        contents=texts,
        config=types.EmbedContentConfig(output_dimensionality=768),
    )

    return response.embeddings


def store_data_sets(animes: list[AnimeInsert]) -> list:
    records = [anime.model_dump() for anime in animes]
    response = sb.table("anime").upsert(records, on_conflict="mal_id").execute()
    return response.data


def semantic_search(query: str) -> str:
    """
    Searches the anime database for anime that semantically match the given query.
    Use this tool whenever the user asks for anime recommendations, descriptions,
    or anything related to finding anime based on themes, genres, mood or plot.

    Args:
        query: A natural language description of the anime the user is looking for.
               Examples: "dark psychological thriller", "heartwarming slice of life",
               "action anime with deep storyline"

    Returns:
        A string containing the most semantically similar anime with their title,
        genres, score and synopsis.
    """

    embedded_query = embed_texts([query])[0].values

    try:
        response = sb.rpc(
            "match_anime",
            {
                "query_embedding": embedded_query,
                "match_threshold": 0.5,
                "match_count": 5,
            },
        ).execute()
    except Exception as e:
        return f"Search failed: {str(e)}"

    matches = response.data

    if not matches:
        return "No anime found matching that description"

    return "\n\n".join(
        [
            f"Title: {m['title']}\n"
            f"Genres: {', '.join(m['genres'])}\n"
            f"Score: {m['score']}\n"
            f"Similarity: {round(m['similarity'], 2)}\n"
            f"Synopsis: {m['synopsis']}"
            for m in matches
        ]
    )


config = types.GenerateContentConfig(
    system_instruction=system_instructions, tools=[semantic_search]
)


def generate_response(query: str) -> str:

    response = model.models.generate_content(
        model="gemini-2.5-flash-lite", contents=query, config=config
    )

    return response.text
