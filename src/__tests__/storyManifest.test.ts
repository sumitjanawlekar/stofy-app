import { describe, expect, it } from "vitest";
import { STORIES, STORY_MAP } from "@/src/data/mockStory";

describe("story manifest graph integrity", () => {
  it("contains all 4 expected stories", () => {
    expect(STORIES).toHaveLength(4);

    const slugs = STORIES.map((story) => story.slug);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "dragon-queen",
        "knight-of-astoria",
        "lady-boss",
        "monsters-academy",
      ]),
    );
  });

  it("each story has valid metadata and a resolvable start scene", () => {
    for (const story of STORIES) {
      expect(story.title.length).toBeGreaterThan(0);
      expect(story.cover_image_url.length).toBeGreaterThan(0);
      expect(story.estimated_duration.length).toBeGreaterThan(0);

      const bundle = STORY_MAP[story.slug];
      expect(bundle).toBeDefined();
      expect(bundle.scenes[story.start_scene_id]).toBeDefined();
    }
  });

  it("all scene choices point to valid target scenes (no broken edges)", () => {
    for (const bundle of Object.values(STORY_MAP)) {
      for (const scene of Object.values(bundle.scenes)) {
        expect(scene.scene_url.startsWith("https://")).toBe(true);
        expect(scene.duration).toBeGreaterThan(0);

        for (const choice of scene.choices) {
          expect(bundle.scenes[choice.target_scene_id]).toBeDefined();
        }
      }
    }
  });

  it("parses valid title_logo_url for catalog stories when configured", () => {
    for (const story of STORIES) {
      if (story.title_logo_url) {
        expect(story.title_logo_url).toMatch(/^https:\/\/res\.cloudinary\.com\//);
      }
    }
  });
});
