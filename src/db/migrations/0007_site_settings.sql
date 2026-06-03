CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO site_settings (key, value, updated_at) VALUES
  ('website', 'https://cloudflare.astro-paper-btv.pages.dev/', CURRENT_TIMESTAMP),
  ('title', 'AstroPaper', CURRENT_TIMESTAMP),
  ('description', 'A minimal, responsive and SEO-friendly Astro blog theme.', CURRENT_TIMESTAMP),
  ('author', 'Sat Naing', CURRENT_TIMESTAMP),
  ('profile', 'https://satnaing.dev/', CURRENT_TIMESTAMP),
  ('ogImage', 'astropaper-og.jpg', CURRENT_TIMESTAMP),
  ('lang', 'en', CURRENT_TIMESTAMP),
  ('dir', 'ltr', CURRENT_TIMESTAMP),
  ('themeColor', '', CURRENT_TIMESTAMP)
ON CONFLICT(key) DO NOTHING;
