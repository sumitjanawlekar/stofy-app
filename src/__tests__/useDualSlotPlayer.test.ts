import { act, renderHook } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { useDualSlotPlayer } from "@/src/hooks/useDualSlotPlayer";
import type { Scene } from "@/src/types/scene";

beforeAll(() => {
  window.HTMLMediaElement.prototype.play = vi
    .fn()
    .mockImplementation(() => Promise.resolve());
  window.HTMLMediaElement.prototype.pause = vi.fn();
  window.HTMLMediaElement.prototype.load = vi.fn();
});

beforeEach(() => {
  vi.clearAllMocks();
});

const testScenes: Record<string, Scene> = {
  scene_01: {
    id: "scene_01",
    story_id: "story_1",
    scene_url: "https://example.com/scene_01.mp4",
    duration: 10,
    choices: [
      {
        id: "c1",
        parent_scene_id: "scene_01",
        label: "Option A",
        target_scene_id: "scene_02_a",
      },
      {
        id: "c2",
        parent_scene_id: "scene_01",
        label: "Option B",
        target_scene_id: "scene_02_b",
      },
    ],
  },
  scene_02_a: {
    id: "scene_02_a",
    story_id: "story_1",
    scene_url: "https://example.com/scene_02_a.mp4",
    duration: 12,
    choices: [],
  },
  scene_02_b: {
    id: "scene_02_b",
    story_id: "story_1",
    scene_url: "https://example.com/scene_02_b.mp4",
    duration: 14,
    choices: [],
  },
};

function createMockVideo(paused = false): HTMLVideoElement {
  const video = document.createElement("video");
  let currentTime = 0;
  Object.defineProperty(video, "paused", {
    configurable: true,
    get: () => paused,
  });
  Object.defineProperty(video, "currentTime", {
    configurable: true,
    get: () => currentTime,
    set: (value: number) => {
      currentTime = value;
    },
  });
  return video;
}

describe("useDualSlotPlayer", () => {
  it("initializes on scene_01 with slot A active", () => {
    const { result } = renderHook(() =>
      useDualSlotPlayer({
        initialSceneId: "scene_01",
        scenes: testScenes,
      }),
    );

    expect(result.current.currentScene.id).toBe("scene_01");
    expect(result.current.activeSlot).toBe("A");
    expect(result.current.slotASrc).toBe("https://example.com/scene_01.mp4");
    expect(result.current.showChoices).toBe(false);
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.isMuted).toBe(false);
  });

  it("prebuffers the primary next branch into the standby slot", () => {
    const { result } = renderHook(() =>
      useDualSlotPlayer({
        initialSceneId: "scene_01",
        scenes: testScenes,
      }),
    );

    expect(result.current.slotBSrc).toBe("https://example.com/scene_02_a.mp4");
  });

  it("shows choices and stops playing when the active scene ends with branches", () => {
    const { result } = renderHook(() =>
      useDualSlotPlayer({
        initialSceneId: "scene_01",
        scenes: testScenes,
      }),
    );

    act(() => {
      result.current.handleActiveEnded();
    });

    expect(result.current.showChoices).toBe(true);
    expect(result.current.isPlaying).toBe(false);
  });

  it("does not show choices when the active scene has no branches", () => {
    const { result } = renderHook(() =>
      useDualSlotPlayer({
        initialSceneId: "scene_02_a",
        scenes: testScenes,
      }),
    );

    act(() => {
      result.current.handleActiveEnded();
    });

    expect(result.current.showChoices).toBe(false);
  });

  it("selectChoice swaps to standby slot B and advances the scene", () => {
    const { result } = renderHook(() =>
      useDualSlotPlayer({
        initialSceneId: "scene_01",
        scenes: testScenes,
      }),
    );

    act(() => {
      result.current.handleActiveEnded();
    });

    act(() => {
      result.current.selectChoice("scene_02_b");
    });

    expect(result.current.currentScene.id).toBe("scene_02_b");
    expect(result.current.activeSlot).toBe("B");
    expect(result.current.slotBSrc).toBe("https://example.com/scene_02_b.mp4");
    expect(result.current.showChoices).toBe(false);
    expect(result.current.isPlaying).toBe(true);
  });

  it("toggles mute state", () => {
    const { result } = renderHook(() =>
      useDualSlotPlayer({
        initialSceneId: "scene_01",
        scenes: testScenes,
      }),
    );

    expect(result.current.isMuted).toBe(false);

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.isMuted).toBe(true);

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.isMuted).toBe(false);
  });

  it("toggles play/pause on the active video element", () => {
    const { result } = renderHook(() =>
      useDualSlotPlayer({
        initialSceneId: "scene_01",
        scenes: testScenes,
      }),
    );

    const videoA = createMockVideo(false);
    result.current.videoRefA.current = videoA;

    act(() => {
      result.current.togglePlayPause();
    });

    expect(videoA.pause).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it("ignores play/pause toggles while choices are visible", () => {
    const { result } = renderHook(() =>
      useDualSlotPlayer({
        initialSceneId: "scene_01",
        scenes: testScenes,
      }),
    );

    const videoA = createMockVideo(false);
    result.current.videoRefA.current = videoA;
    vi.clearAllMocks();

    act(() => {
      result.current.handleActiveEnded();
    });

    act(() => {
      result.current.togglePlayPause();
    });

    expect(videoA.pause).not.toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.showChoices).toBe(true);
  });

  it("updates currentTime and exposes duration", () => {
    const { result } = renderHook(() =>
      useDualSlotPlayer({
        initialSceneId: "scene_01",
        scenes: testScenes,
      }),
    );

    expect(result.current.currentTime).toBe(0);
    expect(result.current.duration).toBe(10);

    const videoA = createMockVideo(false);
    result.current.videoRefA.current = videoA;

    act(() => {
      result.current.seek(3);
    });

    expect(result.current.currentTime).toBe(3);
    expect(videoA.currentTime).toBe(3);
  });

  it("clamps seek time to avoid exceeding the decision window buffer", () => {
    const { result } = renderHook(() =>
      useDualSlotPlayer({
        initialSceneId: "scene_01",
        scenes: testScenes,
      }),
    );

    const videoA = createMockVideo(false);
    result.current.videoRefA.current = videoA;

    // duration=10, MAX_SEEK_BUFFER=5 => maxSeek=5
    act(() => {
      result.current.seek(9);
    });

    expect(result.current.currentTime).toBe(5);
    expect(videoA.currentTime).toBe(5);

    act(() => {
      result.current.seek(-2);
    });

    expect(result.current.currentTime).toBe(0);
    expect(videoA.currentTime).toBe(0);
  });
});
