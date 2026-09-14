"use client";

import { useEffect, useRef, useState } from "react";
import type { Scene } from "@/src/types/scene";
import { MOCK_SCENES } from "@/src/data/mockStory";
import { ChoiceOverlay } from "./ChoiceOverlay";

export interface PlayerProps {
  initialSceneId: string;
  onBack: () => void;
}

export function Player({ initialSceneId, onBack }: PlayerProps) {
  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);

  const [currentScene, setCurrentScene] = useState<Scene>(
    () => MOCK_SCENES[initialSceneId]!,
  );
  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");
  const [slotASrc, setSlotASrc] = useState(
    MOCK_SCENES[initialSceneId]?.scene_url ?? "",
  );
  const [slotBSrc, setSlotBSrc] = useState<string | undefined>(undefined);
  const [showChoices, setShowChoices] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const activeVideo =
      activeSlot === "A" ? videoRefA.current : videoRefB.current;
    const activeSrc = activeSlot === "A" ? slotASrc : slotBSrc;

    if (!activeVideo || !activeSrc) {
      return;
    }

    void activeVideo.play().then(() => {
      setIsPlaying(true);
    });
  }, [activeSlot, slotASrc, slotBSrc]);

  useEffect(() => {
    const standbySlot = activeSlot === "A" ? "B" : "A";

    if (currentScene.choices.length === 0) {
      return;
    }

    const primaryNextScene =
      MOCK_SCENES[currentScene.choices[0].target_scene_id];

    if (!primaryNextScene?.scene_url) {
      return;
    }

    if (standbySlot === "B" && slotBSrc !== primaryNextScene.scene_url) {
      setSlotBSrc(primaryNextScene.scene_url);
      videoRefB.current?.load();
    }

    if (standbySlot === "A" && slotASrc !== primaryNextScene.scene_url) {
      setSlotASrc(primaryNextScene.scene_url);
      videoRefA.current?.load();
    }
  }, [currentScene.id, activeSlot]);

  function handleActiveEnded() {
    if (currentScene.choices.length > 0) {
      setShowChoices(true);
      setIsPlaying(false);
    }
  }

  function handleSelectChoice(targetSceneId: string) {
    const nextScene = MOCK_SCENES[targetSceneId];
    if (!nextScene) {
      return;
    }

    const standbySlot = activeSlot === "A" ? "B" : "A";

    if (standbySlot === "B") {
      if (slotBSrc !== nextScene.scene_url) {
        setSlotBSrc(nextScene.scene_url);
      }
      void videoRefB.current?.play();
      setActiveSlot("B");
    } else {
      if (slotASrc !== nextScene.scene_url) {
        setSlotASrc(nextScene.scene_url);
      }
      void videoRefA.current?.play();
      setActiveSlot("A");
    }

    setCurrentScene(nextScene);
    setShowChoices(false);
    setIsPlaying(true);
  }

  const slotAClassName =
    activeSlot === "A"
      ? "absolute inset-0 w-full h-full object-cover z-10 opacity-100"
      : "absolute inset-0 w-full h-full object-cover z-0 opacity-0 pointer-events-none";

  const slotBClassName =
    activeSlot === "B"
      ? "absolute inset-0 w-full h-full object-cover z-10 opacity-100"
      : "absolute inset-0 w-full h-full object-cover z-0 opacity-0 pointer-events-none";

  return (
    <div className="w-full h-full relative bg-black overflow-hidden select-none">
      <video
        ref={videoRefA}
        src={slotASrc || undefined}
        playsInline
        autoPlay
        muted
        preload="auto"
        className={slotAClassName}
        onLoadedMetadata={(e) => {
          void e.currentTarget.play();
        }}
        onEnded={() => {
          if (activeSlot === "A") {
            handleActiveEnded();
          }
        }}
      />

      {slotBSrc && (
        <video
          ref={videoRefB}
          src={slotBSrc}
          playsInline
          autoPlay
          muted
          preload="auto"
          className={slotBClassName}
          onEnded={() => {
            if (activeSlot === "B") {
              handleActiveEnded();
            }
          }}
        />
      )}

      <header className="absolute left-0 top-0 z-30 p-3">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full z-30 text-white bg-black/60 backdrop-blur-sm text-xl"
        >
          ←
        </button>
      </header>

      {showChoices && (
        <ChoiceOverlay
          choices={currentScene.choices}
          onSelectChoice={handleSelectChoice}
        />
      )}
    </div>
  );
}
