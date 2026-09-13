"use client";

import { useState } from "react";
import { Catalog } from "@/src/components/Catalog";
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
    <div className="w-full h-full flex flex-col p-4 bg-black text-white relative">
      <button
        type="button"
        onClick={() => setSelectedStoryId(null)}
        className="self-start min-h-11 text-sm font-medium text-neutral-300"
      >
        ← Back to Catalog
      </button>
      <p className="flex flex-1 items-center justify-center text-center text-neutral-400">
        {`Ready for Player Engine: ${selectedStoryId}`}
      </p>
    </div>
  );
}
