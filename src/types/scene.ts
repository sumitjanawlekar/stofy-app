import type { Choice } from "./choice";

export interface Scene {
  id: string;
  story_id: string;
  scene_url: string;
  duration: number;
  choices: Choice[];
}
