"use client";

import { useState } from "react";
import { STORIES, STORY_MAP } from "@/src/data/mockStory";
import type { Story } from "@/src/types/story";
import { BrandLogo } from "./BrandLogo";

export interface CatalogProps {
  story?: Story;
  stories?: Story[];
  onSelectStory?: (slug: string) => void;
}

export function Catalog({ onSelectStory, stories }: CatalogProps) {
  const catalogStories = stories ?? STORIES;
  const featuredStory = catalogStories[0];
  const [isExpanded, setIsExpanded] = useState(false);

  function selectStory(slug: string) {
    if (!stories && !STORY_MAP[slug]) return;
    onSelectStory?.(slug);
  }

  return (
    <div className="flex flex-col h-full min-h-[100dvh] w-full max-w-md mx-auto bg-[#0A0A0F] text-white relative overflow-hidden">
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-[-60px] w-72 h-72 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

      <header className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-20">
        <BrandLogo size="md" />
        <span className="px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-semibold tracking-wider text-violet-300 uppercase">
          Trending
        </span>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-4 space-y-5 pb-20 relative z-10">
        {featuredStory && (
          <section className="space-y-3">
            <p className="text-xs font-semibold tracking-wider text-violet-400 uppercase">
              Featured Release
            </p>

            <article className="relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/70 backdrop-blur-md shadow-[0_12px_32px_-8px_rgba(0,0,0,0.8)] transition-all hover:border-violet-500/30">
              <div className="relative w-full overflow-hidden">
                <img
                  src={featuredStory.cover_image_url}
                  alt={featuredStory.title}
                  className="aspect-[4/5] w-full object-cover object-top"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none"
                  style={{ top: "40%" }}
                />
                <span className="absolute top-3.5 right-3.5 bg-black/75 backdrop-blur-md text-neutral-200 text-xs font-medium px-2.5 py-1 rounded-full border border-white/10">
                  {featuredStory.estimated_duration}
                </span>

                <div className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-16 flex flex-col items-center text-center">
                  {featuredStory.title_logo_url ? (
                    <img
                      src={featuredStory.title_logo_url}
                      alt={featuredStory.title}
                      className="h-14 sm:h-16 w-auto max-w-[240px] sm:max-w-[280px] object-contain object-center select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                    />
                  ) : (
                    <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow">
                      {featuredStory.title}
                    </h2>
                  )}

                  <div className="mt-2.5 mb-3.5 w-full max-w-[320px] mx-auto text-center px-2">
                    <p className="text-[11.5px] sm:text-xs text-neutral-200/85 leading-snug font-normal">
                      {isExpanded ? (
                        <>
                          {featuredStory.description}{" "}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsExpanded(false);
                            }}
                            className="inline font-medium text-violet-300 hover:text-violet-200 transition-colors cursor-pointer select-none"
                          >
                            less
                          </button>
                        </>
                      ) : (
                        <>
                          <span>
                            {featuredStory.description
                              .split(" ")
                              .slice(0, 6)
                              .join(" ")}
                          </span>{" "}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsExpanded(true);
                            }}
                            className="inline font-medium text-violet-300 hover:text-violet-200 transition-colors cursor-pointer select-none whitespace-nowrap"
                          >
                            ...more
                          </button>
                        </>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => selectStory(featuredStory.slug)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-violet-950/50 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 translate-x-[0.5px]"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Watch Story</span>
                  </button>
                </div>
              </div>
            </article>
          </section>
        )}

        <section className="space-y-3 px-0">
          <p className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            More Stories
          </p>

          {catalogStories.slice(1).map((story) => (
            <div
              key={story.id}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/70 backdrop-blur-md transition-all hover:border-violet-500/30"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={story.cover_image_url}
                  alt={story.title}
                  className="h-full w-full object-cover object-top"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none"
                  style={{ top: "40%" }}
                />
                <span className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-neutral-200 text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
                  {story.estimated_duration}
                </span>
                <div className="absolute inset-x-0 bottom-0 px-4 pb-3.5 pt-12 flex items-end justify-between gap-3">
                  <div className="flex-1 min-w-0 h-13 sm:h-14 flex items-end justify-start">
                    {story.title_logo_url ? (
                      <img
                        src={story.title_logo_url}
                        alt={story.title}
                        className="max-h-13 sm:max-h-14 max-w-[150px] w-auto h-auto object-contain object-left select-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                      />
                    ) : (
                      <h3 className="text-sm font-bold text-white tracking-tight drop-shadow truncate">
                        {story.title}
                      </h3>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectStory(story.slug);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-violet-950/40 transition-all active:scale-95 shrink-0 cursor-pointer mb-0.5"
                    aria-label={`Watch ${story.title}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3 translate-x-[0.5px]"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Watch Story</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
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
