"use client";

import { useRef, useState } from "react";

export interface PlayerProps {
  sceneUrl: string;
  onEnded?: () => void;
  onBack: () => void;
}

export function Player({ sceneUrl, onEnded, onBack }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  function handleTogglePlayback() {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      <video
        ref={videoRef}
        src={sceneUrl}
        className="w-full h-full object-cover"
        playsInline
        autoPlay
        muted
        onEnded={onEnded}
        onClick={handleTogglePlayback}
      />

      {!isPlaying && (
        <button
          type="button"
          aria-label="Play"
          onClick={handleTogglePlayback}
          className="absolute inset-0 flex items-center justify-center bg-black/30"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-16 w-16 text-white drop-shadow-lg"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        </button>
      )}

      <header className="absolute left-0 top-0 z-10 p-3">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/50 text-xl text-white"
        >
          ←
        </button>
      </header>
    </div>
  );
}
