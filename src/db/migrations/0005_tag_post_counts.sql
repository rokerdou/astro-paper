CREATE TABLE IF NOT EXISTS tag_post_counts (
  tag_id INTEGER PRIMARY KEY REFERENCES tags(id) ON DELETE CASCADE,
  post_count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tag_post_counts_rank
  ON tag_post_counts (post_count DESC, tag_id);

DELETE FROM tag_post_counts;

INSERT INTO tag_post_counts (tag_id, post_count, updated_at)
SELECT
  tags.id,
  COUNT(posts.id) AS post_count,
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now') AS updated_at
FROM tags
LEFT JOIN posts_tags ON posts_tags.tag_id = tags.id
LEFT JOIN posts ON posts.id = posts_tags.post_id
  AND posts.draft = 0
  AND posts.pub_datetime <= strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
GROUP BY tags.id;
