PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  pub_datetime TEXT NOT NULL,
  mod_datetime TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  draft INTEGER NOT NULL DEFAULT 0,
  og_image TEXT,
  cover_image TEXT,
  canonical_url TEXT,
  hide_edit_post INTEGER NOT NULL DEFAULT 0,
  timezone TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);
CREATE INDEX IF NOT EXISTS idx_posts_draft ON posts (draft);
CREATE INDEX IF NOT EXISTS idx_posts_pub_datetime ON posts (pub_datetime);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS posts_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_tags_unique ON posts_tags (post_id, tag_id);
CREATE INDEX IF NOT EXISTS idx_posts_tags_post_id ON posts_tags (post_id);
CREATE INDEX IF NOT EXISTS idx_posts_tags_tag_id ON posts_tags (tag_id);
