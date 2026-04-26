"use client";

import { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
};

export default function InputBar({
  value,
  onChange,
  onSubmit,
  disabled,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) onSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2">
      <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl px-4 py-3 flex items-end gap-3 focus-within:border-purple-400 transition-colors">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the kind of anime you want..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 resize-none outline-none leading-6 max-h-48"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="bg-purple-400 text-zinc-950 font-medium px-4 py-2 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-300 transition-colors shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  );
}
