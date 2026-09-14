"use client";

import { useState } from "react";
import { Catalog } from "@/src/components/Catalog";
import { Player } from "@/src/components/Player";
import { MOCK_STORY } from "@/src/data/mockStory";

export default function Home() {
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  if (!selectedStoryId) {
    return (
      <Catalog
        story={MOCK_STORY}
        onSelectStory={(id) => setSelectedStoryId(id)}
      />
    );
  }

  return (
    <main className="relative w-full h-[100dvh] flex flex-col bg-black overflow-hidden">
      <Player
        initialSceneId={MOCK_STORY.start_scene_id}
        onBack={() => setSelectedStoryId(null)}
      />
    </main>
  );
}
