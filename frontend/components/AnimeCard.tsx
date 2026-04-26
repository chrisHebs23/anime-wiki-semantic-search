export type Anime = {
  id: number;
  mal_id: number;
  title: string;
  synopsis: string | null;
  genres: string[];
  score: number | null;
  episodes: number | null;
  year: number | null;
  similarity: number;
};

export default function AnimeCard({ anime }: { anime: Anime }) {
  return (
    <article className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 hover:border-purple-400/50 transition-colors flex flex-col gap-3">
      <header className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-zinc-100 leading-tight">
          {anime.title}
        </h3>
        <span className="text-xs text-purple-300 bg-purple-400/10 border border-purple-400/20 px-2 py-1 rounded-full whitespace-nowrap">
          {Math.round(anime.similarity * 100)}% match
        </span>
      </header>

      {anime.genres.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {anime.genres.map((g) => (
            <span
              key={g}
              className="text-xs text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded"
            >
              {g}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3 text-xs text-zinc-500">
        {anime.score !== null && <span>★ {anime.score}</span>}
        {anime.episodes !== null && <span>{anime.episodes} ep</span>}
        {anime.year !== null && <span>{anime.year}</span>}
      </div>

      {anime.synopsis && (
        <p className="text-sm text-zinc-400 line-clamp-3">{anime.synopsis}</p>
      )}
    </article>
  );
}
