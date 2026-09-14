import type { Story } from "@/src/types/story";
import type { Scene } from "@/src/types/scene";

export const MOCK_STORY: Story = {
  id: "story_01",
  title: "The Choice",
  description: "An interactive thriller where every decision changes your path.",
  cover_image_url:
    "https://res.cloudinary.com/uvpinyqi/image/upload/v1789362899/Screenshot_2026-09-13_at_10.11.13_PM.jpg",
  start_scene_id: "scene_01",
  estimated_duration: "~2 mins",
};

export const MOCK_SCENES: Record<string, Scene> = {
  scene_01: {
    id: "scene_01",
    story_id: "story_01",
    scene_url: "https://res.cloudinary.com/uvpinyqi/video/upload/v1788914445/01_compressed_scene.mp4#t=135",
    duration: 10,
    choices: [
      {
        id: "choice_01_a",
        parent_scene_id: "scene_01",
        label: "Take the Left Path",
        target_scene_id: "scene_02_a",
      },
      {
        id: "choice_01_b",
        parent_scene_id: "scene_01",
        label: "Take the Right Path",
        target_scene_id: "scene_02_b",
      },
    ],
  },
  scene_02_a: {
    id: "scene_02_a",
    story_id: "story_01",
    scene_url: "https://res.cloudinary.com/uvpinyqi/video/upload/v1788562544/02_B.mp4",
    duration: 10,
    choices: [],
  },
  scene_02_b: {
    id: "scene_02_b",
    story_id: "story_01",
    scene_url: "https://res.cloudinary.com/uvpinyqi/video/upload/v1788562543/02_A.mp4",
    duration: 10,
    choices: [],
  },
};
