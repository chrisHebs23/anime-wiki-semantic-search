import AnimeCard, { type Anime } from "./AnimeCard";

type Props = {
  query: string;
  recommendation?: string;
  matches?: Anime[];
  error?: string;
  loading?: boolean;
};

export default function RecommendationMessage({
  query,
  recommendation,
  matches,
  error,
  loading,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="bg-purple-400/10 border border-purple-400/30 text-zinc-100 rounded-2xl px-4 py-3 max-w-[80%] whitespace-pre-wrap">
          {query}
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
          <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.15s]" />
          <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.3s]" />
          <span className="text-sm ml-2">Finding anime...</span>
        </div>
      )}

      {error && (
        <div className="text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {recommendation && (
        <div className="text-zinc-200 whitespace-pre-wrap leading-relaxed">
          {recommendation}
        </div>
      )}

      {matches && matches.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {matches.map((m) => (
            <AnimeCard key={m.id} anime={m} />
          ))}
        </div>
      )}
    </div>
  );
}
