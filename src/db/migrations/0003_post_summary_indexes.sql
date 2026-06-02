CREATE INDEX IF NOT EXISTS idx_posts_published_sort
  ON posts (draft, mod_datetime, pub_datetime);

CREATE INDEX IF NOT EXISTS idx_posts_tags_lookup
  ON posts_tags (tag_id, post_id);
