export const STORY_STATUS = {
  IN_PROGRESS: "in_progress",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export type StoryStatus = (typeof STORY_STATUS)[keyof typeof STORY_STATUS];

export interface Story {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  start_scene_id: string;
  estimated_duration: string;
}
