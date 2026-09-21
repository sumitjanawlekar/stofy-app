import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { Scene } from "@/src/types/scene";
import { MOCK_SCENES } from "@/src/data/mockStory";

export const MAX_SEEK_BUFFER = 5; // User cannot seek past duration - 5s
export const CHOICE_TRIGGER_BUFFER = 4; // Choices trigger at duration - 4s

export interface UseDualSlotPlayerParams {
  initialSceneId: string;
  scenes?: Record<string, Scene>;
}

export interface UseDualSlotPlayerReturn {
  currentScene: Scene;
  activeSlot: "A" | "B";
  slotASrc: string;
  slotBSrc: string | undefined;
  showChoices: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isScrubbing: boolean;
  setIsScrubbing: (scrubbing: boolean) => void;
  seek: (targetTime: number) => void;
  videoRefA: RefObject<HTMLVideoElement | null>;
  videoRefB: RefObject<HTMLVideoElement | null>;
  togglePlayPause: () => void;
  toggleMute: () => void;
  handleActiveEnded: () => void;
  selectChoice: (targetSceneId: string) => void;
}

export function useDualSlotPlayer({
  initialSceneId,
  scenes = MOCK_SCENES,
}: UseDualSlotPlayerParams): UseDualSlotPlayerReturn {
  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);

  const [currentScene, setCurrentScene] = useState<Scene>(
    () => scenes[initialSceneId]!,
  );
  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");
  const [slotASrc, setSlotASrc] = useState(
    scenes[initialSceneId]?.scene_url ?? "",
  );
  const [slotBSrc, setSlotBSrc] = useState<string | undefined>(undefined);
  const [showChoices, setShowChoices] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(
    () => scenes[initialSceneId]?.duration ?? 0,
  );
  const [isScrubbing, setIsScrubbingState] = useState(false);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(currentScene.duration);
  }, [currentScene.id, activeSlot, currentScene.duration]);

  useEffect(() => {
    const activeVideo =
      activeSlot === "A" ? videoRefA.current : videoRefB.current;
    if (!activeVideo) {
      return;
    }

    const onTimeUpdate = () => {
      if (!isScrubbing) {
        setCurrentTime(activeVideo.currentTime);
      }

      const triggerTime = Math.max(
        0,
        currentScene.duration - CHOICE_TRIGGER_BUFFER,
      );

      if (
        !isScrubbing &&
        currentScene.choices.length > 0 &&
        !showChoices &&
        activeVideo.currentTime >= triggerTime
      ) {
        setShowChoices(true);
      }
    };

    activeVideo.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      activeVideo.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [
    activeSlot,
    slotASrc,
    slotBSrc,
    isScrubbing,
    showChoices,
    currentScene.duration,
    currentScene.choices.length,
  ]);

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

    const primaryNextScene = scenes[currentScene.choices[0].target_scene_id];

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
  }, [currentScene.id, activeSlot, currentScene.choices, scenes, slotASrc, slotBSrc]);

  const handleActiveEnded = useCallback(() => {
    setShowChoices(true);
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (showChoices) {
      return;
    }

    const video =
      activeSlot === "A" ? videoRefA.current : videoRefB.current;
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
  }, [activeSlot, showChoices]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const seek = useCallback(
    (targetTime: number) => {
      const maxSeek = Math.max(0, duration - MAX_SEEK_BUFFER);
      const clampedTime = Math.min(Math.max(0, targetTime), maxSeek);
      const activeVideo =
        activeSlot === "A" ? videoRefA.current : videoRefB.current;

      if (activeVideo) {
        activeVideo.currentTime = clampedTime;
      }

      setCurrentTime(clampedTime);
    },
    [activeSlot, duration],
  );

  const setIsScrubbing = useCallback(
    (scrubbing: boolean) => {
      const activeVideo =
        activeSlot === "A" ? videoRefA.current : videoRefB.current;

      setIsScrubbingState(scrubbing);

      if (scrubbing) {
        activeVideo?.pause();
        setIsPlaying(false);
        return;
      }

      // Resume playback only. Do not force the choice overlay here —
      // even if release is near the choice trigger window
      // (currentTime >= duration - CHOICE_TRIGGER_BUFFER). Let the
      // video play out and timeupdate open choices when it crosses
      // the threshold naturally.
      if (!showChoices && activeVideo) {
        void activeVideo.play();
        setIsPlaying(true);
      }
    },
    [activeSlot, showChoices],
  );

  const selectChoice = useCallback(
    (targetSceneId: string) => {
      const nextScene = scenes[targetSceneId];
      if (!nextScene) {
        return;
      }

      const standbySlot = activeSlot === "A" ? "B" : "A";

      if (standbySlot === "B") {
        if (slotBSrc !== nextScene.scene_url) {
          setSlotBSrc(nextScene.scene_url);
        }
        if (videoRefB.current) {
          videoRefB.current.muted = isMuted;
          void videoRefB.current.play();
        }
        setActiveSlot("B");
      } else {
        if (slotASrc !== nextScene.scene_url) {
          setSlotASrc(nextScene.scene_url);
        }
        if (videoRefA.current) {
          videoRefA.current.muted = isMuted;
          void videoRefA.current.play();
        }
        setActiveSlot("A");
      }

      setCurrentScene(nextScene);
      setShowChoices(false);
      setIsPlaying(true);
    },
    [activeSlot, isMuted, scenes, slotASrc, slotBSrc],
  );

  return {
    currentScene,
    activeSlot,
    slotASrc,
    slotBSrc,
    showChoices,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    isScrubbing,
    setIsScrubbing,
    seek,
    videoRefA,
    videoRefB,
    togglePlayPause,
    toggleMute,
    handleActiveEnded,
    selectChoice,
  };
}
