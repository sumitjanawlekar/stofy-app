"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { STORY_MAP } from "@/src/data/mockStory";
import { useDualSlotPlayer } from "@/src/hooks/useDualSlotPlayer";
import type { Story } from "@/src/types/story";
import { ChoiceOverlay } from "./ChoiceOverlay";
import { BrandLogo } from "./BrandLogo";
import { TimelineScrubber } from "./TimelineScrubber";

const CONTROLS_HIDE_MS = 3000;

export interface PlayerProps {
  storyId: string;
  onBack: () => void;
  story?: Story;
}

export function Player({ storyId, onBack, story }: PlayerProps) {
  const currentStory = story ?? STORY_MAP[storyId]?.story;
  const player = useDualSlotPlayer({
    initialSceneId: currentStory?.start_scene_id ?? "",
    scenes: STORY_MAP[storyId]?.scenes,
  });

  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
  }, []);

  const resetControlsTimer = useCallback(() => {
    clearControlsTimeout();
    if (!player.isPlaying || player.isScrubbing) {
      return;
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, CONTROLS_HIDE_MS);
  }, [clearControlsTimeout, player.isPlaying, player.isScrubbing]);

  useEffect(() => {
    if (!player.isPlaying || player.isScrubbing || player.showChoices) {
      clearControlsTimeout();
      if (!player.isPlaying || player.isScrubbing) {
        setShowControls(true);
      }
      return clearControlsTimeout;
    }

    if (showControls) {
      resetControlsTimer();
    }

    return clearControlsTimeout;
  }, [
    clearControlsTimeout,
    player.isPlaying,
    player.isScrubbing,
    player.showChoices,
    resetControlsTimer,
    showControls,
  ]);

  useEffect(() => {
    player.currentScene.choices.forEach((choice) => {
      if (choice.button_image_url) {
        const img = new Image();
        img.src = choice.button_image_url;
      }
    });
  }, [player.currentScene.choices]);

  const handleControlMouseEnter = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
  }, []);

  const handleControlMouseLeave = useCallback(() => {
    if (player.isPlaying && !player.isScrubbing) {
      resetControlsTimer();
    }
  }, [player.isPlaying, player.isScrubbing, resetControlsTimer]);

  const slotAClassName =
    player.activeSlot === "A"
      ? "absolute inset-0 w-full h-full object-cover z-10 opacity-100"
      : "absolute inset-0 w-full h-full object-cover z-0 opacity-0 pointer-events-none";

  const slotBClassName =
    player.activeSlot === "B"
      ? "absolute inset-0 w-full h-full object-cover z-10 opacity-100"
      : "absolute inset-0 w-full h-full object-cover z-0 opacity-0 pointer-events-none";

  const showHeader = showControls || player.showChoices;

  return (
    <div
      className="relative w-full h-full max-w-md mx-auto bg-black overflow-hidden select-none"
      style={{ overscrollBehavior: "none", touchAction: "manipulation" }}
      onClick={() => {
        if (player.showChoices) return;
        setShowControls((prev) => {
          const next = !prev;
          if (next) resetControlsTimer();
          return next;
        });
      }}
    >
      <video
        ref={player.videoRefA}
        src={player.slotASrc || undefined}
        playsInline
        autoPlay
        muted={player.activeSlot === "A" ? player.isMuted : true}
        preload="auto"
        className={slotAClassName}
        onLoadedMetadata={(e) => {
          e.currentTarget.muted =
            player.activeSlot === "A" ? player.isMuted : true;
          if (player.activeSlot === "A") {
            void e.currentTarget.play();
          }
        }}
        onEnded={() => {
          if (player.activeSlot === "A") {
            player.handleActiveEnded();
          }
        }}
      />

      {player.slotBSrc && (
        <video
          ref={player.videoRefB}
          src={player.slotBSrc}
          playsInline
          muted={player.activeSlot === "B" ? player.isMuted : true}
          preload="auto"
          className={slotBClassName}
          onEnded={() => {
            if (player.activeSlot === "B") {
              player.handleActiveEnded();
            }
          }}
        />
      )}

      {showControls && !player.showChoices && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <button
            type="button"
            aria-label={player.isPlaying ? "Pause" : "Play"}
            onClick={(e) => {
              e.stopPropagation();
              player.togglePlayPause();
              resetControlsTimer();
            }}
            onMouseEnter={handleControlMouseEnter}
            onMouseLeave={handleControlMouseLeave}
            className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)] cursor-pointer pointer-events-auto hover:scale-110 hover:border-white/40 active:scale-95 transition-all duration-150"
          >
            {player.isPlaying ? (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7 text-white"
                aria-hidden="true"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7 text-white"
                aria-hidden="true"
              >
                <path d="M7.5 5.5v13l11-6.5-11-6.5z" />
              </svg>
            )}
          </button>
        </div>
      )}

      <header
        className={`absolute top-0 inset-x-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
          showHeader ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onMouseEnter={handleControlMouseEnter}
        onMouseLeave={handleControlMouseLeave}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }}
            aria-label="Back to Catalog"
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/15 cursor-pointer hover:scale-105 hover:bg-white/20 active:scale-95 transition-all duration-150 shrink-0"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <BrandLogo size="sm" />

          <span className="text-white/30 text-xs select-none">/</span>

          <span className="text-xs sm:text-sm font-medium text-white/90 truncate max-w-[140px] sm:max-w-[200px] tracking-wide">
            {currentStory?.title ?? "Stofy Original"}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            player.toggleMute();
          }}
          aria-label={player.isMuted ? "Unmute" : "Mute"}
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/15 cursor-pointer hover:scale-105 hover:bg-white/20 active:scale-95 transition-all duration-150 shrink-0"
        >
          {player.isMuted ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4 text-white"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.5-4.5v15l-4.5-4.5H4.5v-6h4.5z"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4 text-white"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.5-4.5v15l-4.5-4.5H4.5v-6h2.25z"
              />
            </svg>
          )}
        </button>
      </header>

      {!player.showChoices && (
        <div
          className={`transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onMouseEnter={handleControlMouseEnter}
          onMouseLeave={handleControlMouseLeave}
        >
          <TimelineScrubber
            currentTime={player.currentTime}
            duration={player.duration}
            onSeek={player.seek}
            onScrubbingChange={player.setIsScrubbing}
          />
        </div>
      )}

      {player.showChoices && (
        <ChoiceOverlay
          choices={player.currentScene.choices}
          onSelectChoice={player.selectChoice}
          onBackToCatalog={onBack}
        />
      )}
    </div>
  );
}
