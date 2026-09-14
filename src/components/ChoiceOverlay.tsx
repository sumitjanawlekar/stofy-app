"use client";

import type { Choice } from "@/src/types/choice";

export interface ChoiceOverlayProps {
  choices: Choice[];
  onSelectChoice: (targetSceneId: string) => void;
}

export function ChoiceOverlay({ choices, onSelectChoice }: ChoiceOverlayProps) {
  return (
    <div className="absolute bottom-0 inset-x-0 p-5 pb-9 flex flex-col gap-3 z-30 bg-gradient-to-t from-black via-black/70 to-transparent">
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          onClick={() => onSelectChoice(choice.target_scene_id)}
          className="min-h-13 w-full px-5 py-3.5 rounded-2xl bg-[#130E26]/80 hover:bg-[#1C153B]/90 active:scale-[0.98] transition-all backdrop-blur-xl border border-violet-500/30 hover:border-violet-400/60 shadow-[0_4px_24px_rgba(139,92,246,0.2)] text-white font-semibold text-sm tracking-wide flex items-center justify-between"
        >
          <span>{choice.label}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/20 text-violet-300 text-sm">
            →
          </span>
        </button>
      ))}
    </div>
  );
}
