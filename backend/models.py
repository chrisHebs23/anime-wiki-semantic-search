from pydantic import BaseModel


# Used when inserting a new anime record
class AnimeInsert(BaseModel):
    mal_id: int
    title: str
    synopsis: str | None = None
    genres: list[str] = []
    score: float | None = None
    episodes: int | None = None
    year: int | None = None
    embedding: list[float]


# Used when returning an anime record from Supabase
class AnimeResponse(BaseModel):
    id: int
    mal_id: int
    title: str
    synopsis: str | None = None
    genres: list[str] = []
    score: float | None = None
    episodes: int | None = None
    year: int | None = None


# Used when returning search results with similarity score
class AnimeSearchResult(BaseModel):
    id: int
    mal_id: int
    title: str
    synopsis: str | None = None
    genres: list[str] = []
    score: float | None = None
    episodes: int | None = None
    year: int | None = None
    similarity: float


# Used for the search request body
class SearchRequest(BaseModel):
    query: str
    match_threshold: float = 0.5
    match_count: int = 10
