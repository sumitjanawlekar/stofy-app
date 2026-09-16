"use client";

import { useDualSlotPlayer } from "@/src/hooks/useDualSlotPlayer";
import type { Story } from "@/src/types/story";
import { ChoiceOverlay } from "./ChoiceOverlay";

export interface PlayerProps {
  story: Story;
  onBack: () => void;
}

export function Player({ story, onBack }: PlayerProps) {
  const player = useDualSlotPlayer({ initialSceneId: story.start_scene_id });

  const slotAClassName =
    player.activeSlot === "A"
      ? "absolute inset-0 w-full h-full object-cover z-10 opacity-100"
      : "absolute inset-0 w-full h-full object-cover z-0 opacity-0 pointer-events-none";

  const slotBClassName =
    player.activeSlot === "B"
      ? "absolute inset-0 w-full h-full object-cover z-10 opacity-100"
      : "absolute inset-0 w-full h-full object-cover z-0 opacity-0 pointer-events-none";

  return (
    <div
      className="w-full h-full relative bg-black overflow-hidden select-none touch-none overscroll-none overscroll-y-none"
      style={{ overscrollBehaviorY: "none", touchAction: "none" }}
      onClick={player.togglePlayPause}
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

      {!player.isPlaying && !player.showChoices && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-16 h-16 rounded-full bg-[#130E26]/80 backdrop-blur-xl border border-violet-500/30 flex items-center justify-center text-white shadow-[0_4px_24px_rgba(139,92,246,0.2)]">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8 translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          </div>
        </div>
      )}

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-3">
        <button
          type="button"
          aria-label="Back"
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-[#130E26]/80 backdrop-blur-xl border border-violet-500/30 text-xl text-white shadow-[0_4px_24px_rgba(139,92,246,0.2)]"
        >
          ←
        </button>

        <button
          type="button"
          aria-label={player.isMuted ? "Unmute" : "Mute"}
          onClick={(e) => {
            e.stopPropagation();
            player.toggleMute();
          }}
          className="min-h-11 min-w-11 rounded-full bg-[#130E26]/80 backdrop-blur-xl border border-violet-500/30 text-white flex items-center justify-center shadow-[0_4px_24px_rgba(139,92,246,0.2)]"
        >
          {player.isMuted ? (
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

      {player.showChoices && (
        <ChoiceOverlay
          choices={player.currentScene.choices}
          onSelectChoice={player.selectChoice}
        />
      )}
    </div>
  );
}
