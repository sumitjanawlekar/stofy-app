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
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const activeVideo =
      activeSlot === "A" ? videoRefA.current : videoRefB.current;
    const activeSrc = activeSlot === "A" ? slotASrc : slotBSrc;

    if (!activeVideo || !activeSrc) {
      return;
    }

    activeVideo.muted = isMuted;

    void activeVideo
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        // Autoplay with sound blocked by browser policy; fallback to muted
        setIsMuted(true);
        activeVideo.muted = true;
        void activeVideo.play();
        setIsPlaying(true);
      });
  }, [activeSlot, slotASrc, slotBSrc, isMuted]);

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

    if (videoRefA.current) {
      videoRefA.current.muted = isMuted;
    }
    if (videoRefB.current) {
      videoRefB.current.muted = isMuted;
    }

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
        muted={isMuted}
        preload="auto"
        className={slotAClassName}
        onLoadedMetadata={(e) => {
          e.currentTarget.muted = isMuted;
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
          muted={isMuted}
          preload="auto"
          className={slotBClassName}
          onEnded={() => {
            if (activeSlot === "B") {
              handleActiveEnded();
            }
          }}
        />
      )}

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-3">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-xl text-white"
        >
          ←
        </button>

        <button
          type="button"
          aria-label={isMuted ? "Unmute" : "Mute"}
          onClick={() => setIsMuted(!isMuted)}
          className="min-h-11 min-w-11 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center"
        >
          {isMuted ? (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
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
