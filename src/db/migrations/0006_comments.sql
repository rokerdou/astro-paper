CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email_hash TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  ip_hash TEXT,
  user_agent_hash TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_comments_post_status_created
  ON comments (post_id, status, parent_id, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_comments_parent
  ON comments (parent_id);

CREATE INDEX IF NOT EXISTS idx_comments_moderation
  ON comments (status, created_at DESC, id DESC);
