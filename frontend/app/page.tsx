"use client";

import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import InputBar from "@/components/InputBar";
import RecommendationMessage from "@/components/RecommendationMessage";
import { type Anime } from "@/components/AnimeCard";

type Chat = {
  query: string;
  recommendation?: string;
  matches?: Anime[];
  error?: string;
};

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (text?: string) => {
    const query = (text ?? input).trim();
    if (!query || loading) return;

    setInput("");
    setLoading(true);
    setChats((prev) => [...prev, { query }]);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
      const res = await fetch(`${baseUrl}/api/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const data = await res.json();
      setChats((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          query,
          recommendation: data.recommendation,
          matches: data.matches ?? [],
        };
        return next;
      });
    } catch (e) {
      setChats((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          query,
          error: e instanceof Error ? e.message : "Something went wrong",
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {chats.length === 0 ? (
        <main className="flex-1 flex items-center justify-center">
          <HeroSection onChipClick={(t) => submit(t)} />
        </main>
      ) : (
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
            {chats.map((c, i) => (
              <RecommendationMessage
                key={i}
                query={c.query}
                recommendation={c.recommendation}
                matches={c.matches}
                error={c.error}
                loading={
                  loading &&
                  i === chats.length - 1 &&
                  !c.recommendation &&
                  !c.error
                }
              />
            ))}
          </div>
        </main>
      )}

      <div className="sticky bottom-0 bg-gradient-to-t from-[#0d0a14] via-[#0d0a14] to-transparent pt-4">
        <InputBar
          value={input}
          onChange={setInput}
          onSubmit={() => submit()}
          disabled={loading}
        />
      </div>
    </div>
  );
}
