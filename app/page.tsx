"use client";

import { useState } from "react";
import { Catalog } from "@/src/components/Catalog";
import { Player } from "@/src/components/Player";
import { STORY_MAP } from "@/src/data/mockStory";
import type { Story } from "@/src/types/story";

export default function Home() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  function handleBackToCatalog() {
    setSelectedStory(null);
  }

  if (!selectedStory) {
    return (
      <Catalog
        onSelectStory={(slug) => {
          const bundle = STORY_MAP[slug];
          if (bundle) {
            setSelectedStory(bundle.story);
          }
        }}
      />
    );
  }

  return (
    <main className="relative w-full h-[100dvh] flex flex-col bg-black overflow-hidden">
      <Player
        storyId={selectedStory.slug}
        story={selectedStory}
        onBack={handleBackToCatalog}
      />
    </main>
  );
}
