import type { Story } from "@/src/types/story";
import type { Scene } from "@/src/types/scene";

export const MOCK_STORY: Story = {
  id: "story_01",
  title: "The Choice",
  description: "An interactive thriller where every decision changes your path.",
  cover_image_url:
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
  start_scene_id: "scene_01",
  estimated_duration: "~2 mins",
};

export const MOCK_SCENES: Record<string, Scene> = {
  scene_01: {
    id: "scene_01",
    story_id: "story_01",
    scene_url: "https://res.cloudinary.com/uvpinyqi/video/upload/v1725833446/02_B.mp4",
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
    scene_url: "https://res.cloudinary.com/uvpinyqi/video/upload/v1725833446/02_A.mp4",
    duration: 10,
    choices: [],
  },
  scene_02_b: {
    id: "scene_02_b",
    story_id: "story_01",
    scene_url: "https://res.cloudinary.com/uvpinyqi/video/upload/v1725833446/02_B.mp4",
    duration: 10,
    choices: [],
  },
};
