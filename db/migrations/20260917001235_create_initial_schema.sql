CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(128) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url TEXT NOT NULL,
  start_scene_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  scene_url TEXT NOT NULL,
  duration NUMERIC(5, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE stories
  ADD CONSTRAINT fk_stories_start_scene
  FOREIGN KEY (start_scene_id) REFERENCES scenes(id) ON DELETE SET NULL;

CREATE TABLE choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  target_scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE RESTRICT,
  label VARCHAR(255) NOT NULL,
  button_image_url TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scenes_story_id ON scenes(story_id);
CREATE INDEX IF NOT EXISTS idx_choices_parent_scene_id ON choices(parent_scene_id);
CREATE INDEX IF NOT EXISTS idx_choices_target_scene_id ON choices(target_scene_id);
