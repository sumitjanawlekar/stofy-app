"use client";

import { useMemo } from "react";

interface TimelineScrubberProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onScrubbingChange: (isScrubbing: boolean) => void;
}

function formatSeconds(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function TimelineScrubber({
  currentTime,
  duration,
  onSeek,
  onScrubbingChange,
}: TimelineScrubberProps) {
  const progressPercent = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTime, duration]);

  return (
    <div
      className="absolute bottom-6 inset-x-4 z-30 flex flex-col gap-1 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative flex items-center h-6 cursor-pointer touch-none">
        {/* Track Background */}
        <div className="absolute inset-x-0 h-1 bg-white/20 rounded-full overflow-hidden">
          {/* Active Progress Fill */}
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Native Touch-Friendly Range Slider */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          aria-label="Video timeline scrubber"
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          onPointerDown={() => onScrubbingChange(true)}
          onPointerUp={() => onScrubbingChange(false)}
          onTouchStart={() => onScrubbingChange(true)}
          onTouchEnd={() => onScrubbingChange(false)}
          className="absolute inset-x-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Scrubber Thumb Indicator */}
        <div
          className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] pointer-events-none -translate-x-1/2 transition-transform"
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      {/* Time Badges */}
      <div className="flex justify-between items-center text-[10px] font-medium text-neutral-400 font-mono px-0.5">
        <span>{formatSeconds(currentTime)}</span>
        <span>{formatSeconds(duration)}</span>
      </div>
    </div>
  );
}
