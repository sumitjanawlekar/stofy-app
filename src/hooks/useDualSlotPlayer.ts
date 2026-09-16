import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { Scene } from "@/src/types/scene";
import { MOCK_SCENES } from "@/src/data/mockStory";

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
    if (currentScene.choices.length > 0) {
      setShowChoices(true);
      setIsPlaying(false);
    }
  }, [currentScene.choices.length]);

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
    videoRefA,
    videoRefB,
    togglePlayPause,
    toggleMute,
    handleActiveEnded,
    selectChoice,
  };
}
