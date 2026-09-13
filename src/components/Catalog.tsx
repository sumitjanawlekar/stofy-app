"use client";

import type { Story } from "@/src/types/story";

export interface CatalogProps {
  story: Story;
  onSelectStory: (storyId: string) => void;
}

export function Catalog({ story, onSelectStory }: CatalogProps) {
  return (
    <div className="flex h-full min-h-[100dvh] w-full flex-col bg-black text-white">
      <header className="flex shrink-0 items-center px-4 py-4">
        <h1 className="text-lg font-bold tracking-wide">Stofy</h1>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 pb-6">
        <article className="mx-auto flex w-full max-w-xs flex-col gap-4 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]">
          <div className="relative aspect-[3/4] max-h-[380px] w-full overflow-hidden rounded-2xl bg-neutral-900">
            <img
              src={story.cover_image_url}
              alt={story.title}
              className="h-full max-h-[380px] w-full object-cover rounded-2xl"
            />
            <span className="absolute right-3 top-3 bg-black/70 backdrop-blur-md px-2.5 py-1 text-xs font-medium rounded-full border border-white/10 text-white">
              {story.estimated_duration}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {story.title}
            </h2>
            <p className="text-sm leading-relaxed text-neutral-400">
              {story.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectStory(story.id)}
            className="flex min-h-11 w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-base font-semibold text-black transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            Watch Story
          </button>
        </article>
      </main>
    </div>
  );
}
