from google.genai import types
from clients import model, sb
from models import AnimeInsert


def embedding(synopsis: list[str]):
    response = model.models.embed_content(
        model="gemini-2.5-flash-lite",
        contents=synopsis,
        config=types.EmbedContentConfig(output_dimensionality=768),
    )

    return response.embeddings


def store_data_sets(animes: list[AnimeInsert]):
    records = [anime.model_dump() for anime in animes]

    response = sb.table("anime").insert(records).execute()

    return response.data
