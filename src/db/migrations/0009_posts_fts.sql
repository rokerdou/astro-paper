CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(
  title,
  description,
  search_text,
  content = 'posts',
  content_rowid = 'id',
  tokenize = 'trigram'
);

INSERT INTO posts_fts(posts_fts) VALUES ('rebuild');

CREATE TRIGGER IF NOT EXISTS posts_fts_after_insert AFTER INSERT ON posts BEGIN
  INSERT INTO posts_fts(rowid, title, description, search_text)
  VALUES (new.id, new.title, new.description, new.search_text);
END;

CREATE TRIGGER IF NOT EXISTS posts_fts_after_delete AFTER DELETE ON posts BEGIN
  INSERT INTO posts_fts(posts_fts, rowid, title, description, search_text)
  VALUES ('delete', old.id, old.title, old.description, old.search_text);
END;

CREATE TRIGGER IF NOT EXISTS posts_fts_after_update AFTER UPDATE OF title, description, search_text ON posts BEGIN
  INSERT INTO posts_fts(posts_fts, rowid, title, description, search_text)
  VALUES ('delete', old.id, old.title, old.description, old.search_text);
  INSERT INTO posts_fts(rowid, title, description, search_text)
  VALUES (new.id, new.title, new.description, new.search_text);
END;
