"use client";

import type { Choice } from "@/src/types/choice";

export interface ChoiceOverlayProps {
  choices: Choice[];
  onSelectChoice: (targetSceneId: string) => void;
}

export function ChoiceOverlay({ choices, onSelectChoice }: ChoiceOverlayProps) {
  return (
    <div className="absolute bottom-0 inset-x-0 p-5 pb-8 flex flex-col gap-3 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          onClick={() => onSelectChoice(choice.target_scene_id)}
          className="min-h-12 w-full px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 active:scale-[0.98] transition-all backdrop-blur-md border border-white/20 text-white font-semibold text-center text-sm shadow-lg"
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}
