import time
import httpx
from models import AnimeInsert
from services import embed_texts, store_data_sets
from google.genai import errors as genai_errors


def fetch_anime(total: int = 500) -> list[dict]:
    anime_list = []
    page = 1
    per_page = 25

    print(f"Fetching {total} anime from Jikan...")

    while len(anime_list) < total:
        try:
            response = httpx.get(
                "https://api.jikan.moe/v4/anime",
                params={
                    "page": page,
                    "limit": per_page,
                    "order_by": "score",
                    "sort": "desc",
                    "min_score": 6,
                    "sfw": True,
                },
            )

            response.raise_for_status()
            data = response.json()

            if not data.get("data"):
                print(f"No more data at page {page}")
                break

            for item in data["data"]:
                if not item.get("synopsis"):
                    continue

                anime_list.append(
                    {
                        "mal_id": item["mal_id"],
                        "title": item["title"],
                        "synopsis": item["synopsis"],
                        "genres": [g["name"] for g in item.get("genres", [])],
                        "score": item.get("score"),
                        "episodes": item.get("episodes"),
                        "year": item.get("year"),
                    }
                )

            print(f"Page {page} fetched — {len(anime_list)} anime collected so far")
            page += 1
            time.sleep(1)

        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                print("Rate limited — waiting 60 seconds...")
                time.sleep(60)
            else:
                print(f"HTTP error on page {page}: {e}")
                break

        except Exception as e:
            print(f"Unexpected error on page {page}: {e}")
            break

    return anime_list[:total]


def seed(total: int = 500, batch_size: int = 25):
    raw_anime = fetch_anime(total)
    print(f"\nFetched {len(raw_anime)} anime — starting embed and store...\n")

    for i in range(0, len(raw_anime), batch_size):
        batch = raw_anime[i : i + batch_size]
        synopses = [anime["synopsis"] for anime in batch]

        # Retry loop for rate limit handling
        while True:
            try:
                embeddings = embed_texts(synopses)
                break  # success — exit retry loop

            except genai_errors.ClientError as e:
                if "429" in str(e):
                    print(f"Rate limited — waiting 60 seconds before retrying...")
                    time.sleep(60)
                else:
                    raise e

        anime_inserts = []
        for anime, embed in zip(batch, embeddings):
            anime_inserts.append(
                AnimeInsert(
                    mal_id=anime["mal_id"],
                    title=anime["title"],
                    synopsis=anime["synopsis"],
                    genres=anime["genres"],
                    score=anime["score"],
                    episodes=anime["episodes"],
                    year=anime["year"],
                    embedding=embed.values,
                )
            )

        store_data_sets(anime_inserts)
        print(
            f"Stored batch {i // batch_size + 1} — {min(i + batch_size, len(raw_anime))} / {len(raw_anime)} anime inserted"
        )

        # Small delay between batches to avoid hitting limit again immediately
        time.sleep(2)

    print("\nSeed complete")


if __name__ == "__main__":
    seed()
