import { query } from "@/src/lib/db";
import { formatMinutes } from "@/src/lib/utils/formatters";
import { STORY_STATUS, type Story, type StoryStatus } from "@/src/types/story";

interface ActiveStoryRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string;
  status: StoryStatus;
  start_scene_id: string | null;
  total_duration_seconds: string | number;
}

export async function getActiveStories(): Promise<Story[]> {
  const result = await query<ActiveStoryRow>(
    `
      SELECT
        s.id,
        s.slug,
        s.title,
        s.description,
        s.cover_image_url,
        s.status,
        s.start_scene_id,
        COALESCE(ROUND(SUM(sc.duration)), 0) AS total_duration_seconds
      FROM stories s
      LEFT JOIN scenes sc ON sc.story_id = s.id
      WHERE s.status IN ($1, $2)
      GROUP BY s.id, s.created_at
      ORDER BY s.created_at DESC
    `,
    [STORY_STATUS.IN_PROGRESS, STORY_STATUS.PUBLISHED],
  );

  return result.rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    cover_image_url: row.cover_image_url,
    status: row.status,
    start_scene_id: row.start_scene_id ?? "",
    estimated_duration: formatMinutes(Number(row.total_duration_seconds)),
  }));
}
