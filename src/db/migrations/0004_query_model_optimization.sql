ALTER TABLE posts ADD COLUMN sort_datetime TEXT NOT NULL DEFAULT '';

UPDATE posts
SET sort_datetime = COALESCE(mod_datetime, pub_datetime)
WHERE sort_datetime = '';

CREATE INDEX IF NOT EXISTS idx_posts_published_sort_datetime
  ON posts (draft, sort_datetime DESC, id DESC);
