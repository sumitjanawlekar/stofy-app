"use client";

import type { Story } from "@/src/types/story";

export interface CatalogProps {
  story: Story;
  onSelectStory: (storyId: string) => void;
}

export function Catalog({ story, onSelectStory }: CatalogProps) {
  return (
    <div className="flex flex-col h-full min-h-[100dvh] w-full max-w-md mx-auto bg-[#0A0A0F] text-white relative overflow-hidden">
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-[-60px] w-72 h-72 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

      <header className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3.5 w-3.5 text-white translate-x-px"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          </div>
          <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            stofy.ai
          </h1>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-semibold tracking-wider text-violet-300 uppercase">
          Trending
        </span>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-4 space-y-5 pb-20 relative z-10">
        <section className="space-y-3">
          <p className="text-xs font-semibold tracking-wider text-violet-400 uppercase">
            Featured Release
          </p>

          <article className="relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/70 backdrop-blur-md shadow-[0_12px_32px_-8px_rgba(0,0,0,0.8)] transition-all hover:border-violet-500/30">
            <div className="relative w-full overflow-hidden">
              <img
                src={story.cover_image_url}
                alt={story.title}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <span className="absolute top-3.5 right-3.5 bg-black/75 backdrop-blur-md text-neutral-200 text-xs font-medium px-2.5 py-1 rounded-full border border-white/10">
                {story.estimated_duration}
              </span>

              <div className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-16">
                <h2 className="text-[1.35rem] font-bold text-white tracking-tight leading-snug">
                  {story.title}
                </h2>
                <p className="text-xs text-neutral-300/90 leading-relaxed line-clamp-2 mt-1.5">
                  {story.description}
                </p>
                <button
                  type="button"
                  onClick={() => onSelectStory(story.id)}
                  className="w-full min-h-12 mt-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:brightness-110 active:scale-[0.98] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25 transition-all"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7L8 5z" />
                  </svg>
                  Watch Story
                </button>
              </div>
            </div>
          </article>
        </section>

        <section className="space-y-3 px-0">
          <p className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            Upcoming Stories
          </p>

          <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/70 backdrop-blur-md opacity-55 pointer-events-none">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80"
                alt="The Cipher"
                className="h-full w-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <span className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-neutral-200 text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
                🔒 Coming Soon
              </span>
              <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-8">
                <h3 className="text-base font-bold text-white tracking-tight">
                  The Cipher
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-1 mt-0.5">
                  Decode the message before time runs out.
                </p>
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/70 backdrop-blur-md opacity-55 pointer-events-none">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80"
                alt="Shadow Protocol"
                className="h-full w-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <span className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-neutral-200 text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
                🔒 Coming Soon
              </span>
              <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-8">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Shadow Protocol
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-1 mt-0.5">
                  One wrong move and the mission collapses.
                </p>
              </div>
            </div>
          </article>
        </section>
      </main>

      <nav className="sticky bottom-0 z-30 border-t border-white/[0.06] bg-[#0A0A0F]/90 backdrop-blur-xl py-2.5 px-6 flex justify-around items-center text-xs text-neutral-400">
        <button
          type="button"
          className="flex min-h-11 flex-col items-center justify-center gap-1 text-violet-400"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          Home
        </button>
        <button
          type="button"
          className="flex min-h-11 flex-col items-center justify-center gap-1"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
          Discover
        </button>
        <button
          type="button"
          className="flex min-h-11 flex-col items-center justify-center gap-1"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
          </svg>
          Library
        </button>
      </nav>
    </div>
  );
}
