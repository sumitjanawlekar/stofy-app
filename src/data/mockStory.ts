import dragonQueenFixture from "@/db/fixtures/stories/dragon-queen.json";
import knightOfAstoriaFixture from "@/db/fixtures/stories/knight-of-astoria.json";
import ladyBossFixture from "@/db/fixtures/stories/lady-boss.json";
import monstersAcademyFixture from "@/db/fixtures/stories/monsters-academy.json";
import { formatMinutes } from "@/src/lib/utils/formatters";
import type { Choice } from "@/src/types/choice";
import type { Scene } from "@/src/types/scene";
import { STORY_STATUS, type Story, type StoryStatus } from "@/src/types/story";

interface FixtureChoice {
  label: string;
  button_image_url?: string | null;
  target_scene_key: string;
  sort_order?: number;
}

interface FixtureScene {
  key: string;
  scene_url: string;
  duration: number;
  choices: FixtureChoice[];
}

interface FixtureStory {
  slug: string;
  title: string;
  description: string;
  cover_image_url: string;
  title_logo_url?: string;
  status: string;
  start_scene_key: string;
  scenes: FixtureScene[];
}

interface StoryBundle {
  story: Story;
  scenes: Record<string, Scene>;
}

function sceneId(slug: string, key: string): string {
  return `${slug}_${key}`;
}

function choiceId(slug: string, parentKey: string, index: number): string {
  return `${slug}_${parentKey}_choice_${index}`;
}

function toStoryStatus(value: string): StoryStatus {
  const allowed = Object.values(STORY_STATUS) as string[];
  if (!allowed.includes(value)) {
    throw new Error(`Invalid story status in fixture: ${value}`);
  }
  return value as StoryStatus;
}

export function parseFixtureToBundle(fixture: FixtureStory): StoryBundle {
  const storyId = fixture.slug;
  const scenes: Record<string, Scene> = {};

  for (const fixtureScene of fixture.scenes) {
    const id = sceneId(fixture.slug, fixtureScene.key);
    const choices: Choice[] = fixtureScene.choices.map((choice, index) => ({
      id: choiceId(fixture.slug, fixtureScene.key, index),
      parent_scene_id: id,
      label: choice.label,
      target_scene_id: sceneId(fixture.slug, choice.target_scene_key),
      button_image_url: choice.button_image_url ?? undefined,
    }));

    scenes[id] = {
      id,
      story_id: storyId,
      scene_url: fixtureScene.scene_url,
      duration: fixtureScene.duration,
      choices,
    };

  }

  const totalSeconds = fixture.scenes.reduce(
    (sum, scene) => sum + scene.duration,
    0,
  );

  const story: Story = {
    id: storyId,
    slug: fixture.slug,
    title: fixture.title,
    description: fixture.description,
    cover_image_url: fixture.cover_image_url,
    title_logo_url: fixture.title_logo_url,
    status: toStoryStatus(fixture.status),
    start_scene_id: sceneId(fixture.slug, fixture.start_scene_key),
    estimated_duration: formatMinutes(totalSeconds),
  };

  return { story, scenes };
}

export const STORY_MAP: Record<string, StoryBundle> = {
  "dragon-queen": parseFixtureToBundle(dragonQueenFixture),
  "knight-of-astoria": parseFixtureToBundle(knightOfAstoriaFixture),
  "lady-boss": parseFixtureToBundle(ladyBossFixture),
  "monsters-academy": parseFixtureToBundle(monstersAcademyFixture),
};

export const STORIES: Story[] = Object.values(STORY_MAP).map(
  (bundle) => bundle.story,
);

export const MOCK_STORY = STORY_MAP["dragon-queen"].story;
export const MOCK_SCENES = STORY_MAP["dragon-queen"].scenes;
