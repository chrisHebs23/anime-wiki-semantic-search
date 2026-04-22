from google.genai import types
from clients import model, sb


def embedding(synopsis: list[str]):
    response = model.models.embed_content(
        model="gemini-2.5-flash-lite",
        contents=synopsis,
        config=types.EmbedContentConfig(output_dimensionality=768),
    )

    return response.embeddings


def store_data(anime, synopsis_embedding):
    sb.table("anime").insert
