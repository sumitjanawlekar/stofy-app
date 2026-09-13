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

      <main className="flex flex-1 flex-col px-4 pb-6">
        <article className="flex flex-1 flex-col gap-4">
          <div className="relative aspect-[9/14] w-full overflow-hidden rounded-xl bg-neutral-900">
            <img
              src={story.cover_image_url}
              alt={story.title}
              className="h-full w-full object-cover rounded-xl"
            />
            <span className="absolute right-3 top-3 bg-neutral-800/80 text-xs px-2.5 py-1 rounded-full text-white">
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
            className="mt-auto flex min-h-11 w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-base font-semibold text-black transition-opacity active:opacity-80"
          >
            Watch Story
          </button>
        </article>
      </main>
    </div>
  );
}
