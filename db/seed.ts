import "./load-env";

import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import type { PoolClient } from "@neondatabase/serverless";
import { pool } from "@/src/lib/db";
import { STORY_STATUS, type StoryStatus } from "@/src/types/story";

interface FixtureChoice {
  label: string;
  button_image_url: string | null;
  target_scene_key: string;
  sort_order: number;
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
  status?: StoryStatus;
  start_scene_key: string;
  scenes: FixtureScene[];
}

interface IdRow {
  id: string;
}

const FIXTURES_DIR = join(process.cwd(), "db", "fixtures", "stories");

function loadFixture(slug: string): FixtureStory {
  const fixturePath = join(FIXTURES_DIR, `${slug}.json`);
  const story = JSON.parse(readFileSync(fixturePath, "utf8")) as FixtureStory;

  if (story.slug !== slug) {
    throw new Error(
      `Fixture slug mismatch: file "${slug}.json" declares slug "${story.slug}"`,
    );
  }

  return story;
}

function resolveFixtureSlugs(scopeSlug: string | undefined): string[] {
  if (scopeSlug) {
    const fixturePath = join(FIXTURES_DIR, `${scopeSlug}.json`);
    try {
      readFileSync(fixturePath, "utf8");
    } catch {
      throw new Error(
        `No fixture found for slug "${scopeSlug}" at ${fixturePath}`,
      );
    }
    return [scopeSlug];
  }

  const files = readdirSync(FIXTURES_DIR).filter((name) =>
    name.endsWith(".json"),
  );

  if (files.length === 0) {
    throw new Error(`No story fixtures found in ${FIXTURES_DIR}`);
  }

  return files
    .map((name) => name.replace(/\.json$/, ""))
    .sort((a, b) => a.localeCompare(b));
}

async function ingestStory(
  client: PoolClient,
  story: FixtureStory,
): Promise<void> {
  console.log(`[db:seed] Upserting story: ${story.slug}`);

  const storyResult = await client.query<IdRow>(
    `
      INSERT INTO stories (slug, title, description, cover_image_url, status)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (slug) DO UPDATE
      SET title = EXCLUDED.title,
          description = EXCLUDED.description,
          cover_image_url = EXCLUDED.cover_image_url,
          status = EXCLUDED.status,
          updated_at = NOW()
      RETURNING id
    `,
    [
      story.slug,
      story.title,
      story.description,
      story.cover_image_url,
      story.status ?? STORY_STATUS.IN_PROGRESS,
    ],
  );

  const storyId = storyResult.rows[0]?.id;
  if (!storyId) {
    throw new Error(`Failed to upsert story: ${story.slug}`);
  }

  // Null root link, then remove graph. choices.target_scene_id is
  // ON DELETE RESTRICT, so choices must be cleared before scenes.
  await client.query(
    `UPDATE stories SET start_scene_id = NULL, updated_at = NOW() WHERE id = $1`,
    [storyId],
  );
  await client.query(
    `
      DELETE FROM choices
      WHERE parent_scene_id IN (SELECT id FROM scenes WHERE story_id = $1)
         OR target_scene_id IN (SELECT id FROM scenes WHERE story_id = $1)
    `,
    [storyId],
  );
  await client.query(`DELETE FROM scenes WHERE story_id = $1`, [storyId]);
  console.log(`[db:seed] Cleared existing scenes/choices for ${story.slug}`);

  const sceneKeyToId = new Map<string, string>();

  for (const scene of story.scenes) {
    const sceneResult = await client.query<IdRow>(
      `
        INSERT INTO scenes (story_id, scene_url, duration)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      [storyId, scene.scene_url, scene.duration],
    );

    const sceneId = sceneResult.rows[0]?.id;
    if (!sceneId) {
      throw new Error(
        `Failed to insert scene ${scene.key} for story ${story.slug}`,
      );
    }

    sceneKeyToId.set(scene.key, sceneId);
    console.log(
      `[db:seed] Inserted scene ${scene.key} -> ${sceneId} (${story.slug})`,
    );
  }

  const startSceneId = sceneKeyToId.get(story.start_scene_key);
  if (!startSceneId) {
    throw new Error(
      `start_scene_key "${story.start_scene_key}" not found for story ${story.slug}`,
    );
  }

  await client.query(
    `
      UPDATE stories
      SET start_scene_id = $1, updated_at = NOW()
      WHERE id = $2
    `,
    [startSceneId, storyId],
  );
  console.log(
    `[db:seed] Linked start_scene_id for ${story.slug} -> ${startSceneId}`,
  );

  for (const scene of story.scenes) {
    const parentSceneId = sceneKeyToId.get(scene.key);
    if (!parentSceneId) {
      throw new Error(
        `Missing parent scene UUID for key ${scene.key} (${story.slug})`,
      );
    }

    for (const choice of scene.choices) {
      const targetSceneId = sceneKeyToId.get(choice.target_scene_key);
      if (!targetSceneId) {
        throw new Error(
          `Missing target scene key "${choice.target_scene_key}" for choice "${choice.label}" (${story.slug})`,
        );
      }

      await client.query(
        `
          INSERT INTO choices (
            parent_scene_id,
            target_scene_id,
            label,
            button_image_url,
            sort_order
          )
          VALUES ($1, $2, $3, $4, $5)
        `,
        [
          parentSceneId,
          targetSceneId,
          choice.label,
          choice.button_image_url,
          choice.sort_order,
        ],
      );
    }
  }

  console.log(`[db:seed] Finished story: ${story.slug}`);
}

async function seed(): Promise<void> {
  const scopeSlug = process.argv[2];
  const slugs = resolveFixtureSlugs(scopeSlug);
  const stories = slugs.map(loadFixture);

  console.log(
    scopeSlug
      ? `[db:seed] Scoped ingestion for slug: ${scopeSlug}`
      : `[db:seed] Loaded ${stories.length} story fixtures.`,
  );

  const client = await pool.connect();

  try {
    for (const story of stories) {
      try {
        await client.query("BEGIN");
        console.log(`[db:seed] Transaction started for ${story.slug}.`);

        await ingestStory(client, story);

        await client.query("COMMIT");
        console.log(`[db:seed] Transaction committed for ${story.slug}.`);
      } catch (error) {
        await client.query("ROLLBACK");
        console.error(`[db:seed] Transaction rolled back for ${story.slug}.`);
        throw error;
      }
    }
  } finally {
    client.release();
    await pool.end();
    console.log("[db:seed] Client released and pool closed.");
  }
}

seed().catch((error: unknown) => {
  console.error("[db:seed] Failed:", error);
  process.exitCode = 1;
});
