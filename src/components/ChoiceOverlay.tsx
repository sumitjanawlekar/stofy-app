"use client";

import type { Choice } from "@/src/types/choice";

export interface ChoiceOverlayProps {
  choices: Choice[];
  onSelectChoice: (targetSceneId: string) => void;
  onBackToCatalog?: () => void;
}

export function ChoiceOverlay({
  choices,
  onSelectChoice,
  onBackToCatalog,
}: ChoiceOverlayProps) {
  if (choices.length === 0) {
    return (
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-40 max-w-sm mx-auto p-6 rounded-2xl bg-[#130E26]/90 backdrop-blur-xl border border-violet-500/30 text-center space-y-4 shadow-[0_12px_32px_rgba(0,0,0,0.8)] pointer-events-auto">
        <h3 className="text-lg font-bold text-white">To Be Continued...</h3>
        <p className="text-xs text-neutral-300 leading-relaxed">
          You&apos;ve reached the edge of this branch. More story paths are
          currently in production.
        </p>
        <button
          type="button"
          onClick={onBackToCatalog}
          className="w-full min-h-11 px-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-violet-600/30 active:scale-95 transition-all"
        >
          Explore Other Stories
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-x-0 bottom-[10%] sm:bottom-14 z-40 px-4 flex justify-center pointer-events-auto animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-forwards">
      <div
        className={`grid w-full max-w-md gap-4 items-center ${
          choices.length === 2 ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            onClick={() => onSelectChoice(choice.target_scene_id)}
            aria-label={choice.label}
            className="group relative flex items-center justify-center p-1 min-h-16 focus:outline-none"
          >
            {choice.button_image_url ? (
              <>
                <img
                  src={choice.button_image_url}
                  alt={choice.label}
                  className="w-full h-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)] group-hover:scale-105 active:scale-95 transition-transform duration-200"
                />
                <span className="sr-only">{choice.label}</span>
              </>
            ) : (
              <div className="min-h-16 w-full p-3 rounded-2xl bg-[#130E26]/85 backdrop-blur-xl border border-violet-500/40 flex items-center justify-center text-center text-xs font-semibold text-white">
                {choice.label}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
