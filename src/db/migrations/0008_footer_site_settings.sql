INSERT INTO site_settings (key, value, updated_at) VALUES
  ('copyright', 'All rights reserved.', CURRENT_TIMESTAMP),
  ('footerText', 'Powered by Astro Paper & Gemini.', CURRENT_TIMESTAMP),
  ('githubUrl', 'https://github.com/satnaing/astro-paper', CURRENT_TIMESTAMP),
  ('twitterUrl', 'https://x.com/username', CURRENT_TIMESTAMP),
  ('linkedinUrl', 'https://www.linkedin.com/in/username/', CURRENT_TIMESTAMP),
  ('email', 'yourmail@gmail.com', CURRENT_TIMESTAMP)
ON CONFLICT(key) DO NOTHING;
