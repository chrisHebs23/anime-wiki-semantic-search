type Props = {
  onChipClick: (text: string) => void;
};

const examples = [
  "dark psychological thriller",
  "wholesome slice of life",
  "epic shonen with strong worldbuilding",
  "mind-bending sci-fi",
];

export default function HeroSection({ onChipClick }: Props) {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto px-6">
      <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-br from-white to-purple-300 bg-clip-text text-transparent">
        AniMatch
      </h1>
      <p className="text-zinc-400 text-lg mb-10">
        Describe a vibe, mood or theme — find the anime that fits.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {examples.map((example) => (
          <button
            key={example}
            onClick={() => onChipClick(example)}
            className="px-4 py-2 rounded-full border border-zinc-800 text-sm text-zinc-300 hover:border-purple-400 hover:text-purple-300 transition-colors"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
