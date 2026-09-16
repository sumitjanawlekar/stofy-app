"use client";

import { useState } from "react";
import { Catalog } from "@/src/components/Catalog";
import { Player } from "@/src/components/Player";
import { MOCK_STORY } from "@/src/data/mockStory";
import type { Story } from "@/src/types/story";

export default function Home() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  function handleBackToCatalog() {
    setSelectedStory(null);
  }

  if (!selectedStory) {
    return (
      <Catalog
        story={MOCK_STORY}
        onSelectStory={(id) => {
          if (id === MOCK_STORY.id) {
            setSelectedStory(MOCK_STORY);
          }
        }}
      />
    );
  }

  return (
    <main className="relative w-full h-[100dvh] flex flex-col bg-black overflow-hidden">
      <Player story={selectedStory} onBack={handleBackToCatalog} />
    </main>
  );
}
