# AstroPaper Cloudflare SSR

AstroPaper Cloudflare SSR is a blog system built on Astro, React, TanStack Query,
Cloudflare Pages Workers, D1, KV, and Pagefind. It keeps Astro's server-rendered
HTML and SEO strengths while adding a database-backed admin console for posts,
site settings, comments, and tags.

## Architecture

- Public pages are rendered by Astro SSR on Cloudflare Pages Workers.
- Blog data is stored in Cloudflare D1.
- Markdown is rendered before it is saved, then stored as `body_html`,
  `headings`, and `search_text` so public requests do not render markdown on the
  hot path.
- Pagefind is generated at build time from the rendered site output.
- Admin pages use React and TanStack Query. Public article pages do not hydrate
  the admin editor code.
- Sessions use the `SESSION` KV namespace.
- Public cache is purged after post, comment, tag, or site setting changes.

## Requirements

- Node.js 20+
- npm
- Wrangler 4+
- A Cloudflare account with Pages, D1, and KV enabled

Install dependencies:

```bash
npm install
```

Check Wrangler authentication:

```bash
npx wrangler whoami
```

## Cloudflare Resources

Create a D1 database:

```bash
npx wrangler d1 create astro-paper
```

Create a KV namespace for admin sessions:

```bash
npx wrangler kv namespace create SESSION
```

Copy the generated ids into `wrangler.jsonc`:

```jsonc
{
  "pages_build_output_dir": "./dist",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "astro-paper",
      "database_id": "your-d1-database-id",
      "migrations_dir": "./src/db/migrations"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "SESSION",
      "id": "your-kv-namespace-id"
    }
  ]
}
```

## Environment Variables

Configure these as Cloudflare Pages secrets for both Preview and Production:

```bash
npx wrangler pages secret put ADMIN_USERNAME --project-name astro-paper
npx wrangler pages secret put ADMIN_PASSWORD --project-name astro-paper
npx wrangler pages secret put COMMENT_HASH_SECRET --project-name astro-paper
```

For local development, put equivalent values in `.dev.vars`:

```dotenv
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
COMMENT_HASH_SECRET=replace-with-a-long-random-secret
```

`admin/admin` is acceptable only for local testing. Change it before exposing the
admin console publicly.

## Database Setup

Apply all D1 migrations locally:

```bash
npx wrangler d1 migrations apply astro-paper --local
```

Apply all D1 migrations remotely:

```bash
npx wrangler d1 migrations apply astro-paper --remote
```

If you already have markdown content or imported rows that do not include
rendered HTML, backfill the derived fields:

```bash
npm run backfill:rendered
```

The important D1 tables are:

- `posts`: canonical article records and pre-rendered article HTML.
- `tags`: tag names and slugs.
- `posts_tags`: many-to-many post/tag relation.
- `tag_post_counts`: materialized tag counts for cheaper tag navigation.
- `comments`: article comments and moderation status.
- `site_settings`: runtime site title, SEO metadata, footer links, and copyright.

## Local Development

Start Astro locally:

```bash
npm run dev
```

Build the full site:

```bash
npm run build
```

The build runs `astro check`, `astro build`, generates the Pagefind index from
`dist`, and copies the index to `public/pagefind`.

## Deploy To Cloudflare Pages

Build first:

```bash
npm run build
```

Deploy the `dist` output:

```bash
npx wrangler pages deploy dist --project-name astro-paper
```

After deployment, verify:

- Public home page: `/`
- Posts list: `/posts/`
- One article page: `/posts/{slug}/`
- Admin console: `/admin`
- Site settings: `/admin/settings`
- Comments moderation: `/admin/comments`
- RSS: `/rss.xml`
- Sitemap: `/sitemap-index.xml`

## Admin Workflow

The admin console is available at `/admin`.

Posts:

- Create posts from `/admin/posts/new`.
- Edit posts from `/admin/posts/edit/{slug}`.
- The `Post URL` field controls `posts.slug` and therefore the public URL:
  `/posts/{slug}/`.
- New posts can leave the URL empty; it is generated from the title.
- Editing a post URL updates the existing row and purges both the old and new
  article URLs from the public cache.

Site settings:

- Edit site title, website URL, meta description, author, language, direction,
  OG image, theme color, footer text, copyright, GitHub, X/Twitter, LinkedIn,
  and email from `/admin/settings`.
- These values are server-rendered into public pages and RSS.
- Empty footer social links are hidden.

Comments:

- Public comment submission is stored as `pending`.
- Approve, reject, or delete comments from `/admin/comments`.

## SEO And Performance Notes

- Public pages return complete HTML from Astro SSR, including title, meta
  description, canonical URL, Open Graph tags, Twitter tags, JSON-LD, RSS links,
  and article content.
- Markdown rendering is not performed on normal public page requests. The
  rendered HTML is saved with the post.
- Admin React bundles are only loaded on admin routes.
- Comment JavaScript is isolated to article pages that render comments.
- Site settings are read server-side. They do not add a public client-side fetch.
- D1 queries use slug, publication status, pagination, and tag count structures
  designed to keep page load cost bounded.
- Pagefind remains build-time search. Rebuild and redeploy after large content
  changes when the static search index needs to include the latest content.

## Useful Commands

```bash
npm run build
npm run lint
npm run format:check
npx wrangler d1 migrations apply astro-paper --remote
npx wrangler pages deploy dist --project-name astro-paper
```

## Production Checklist

- Replace default admin credentials.
- Set a long random `COMMENT_HASH_SECRET`.
- Apply D1 migrations remotely.
- Confirm `wrangler.jsonc` points to the correct D1 and KV ids.
- Configure the canonical `website` value in `/admin/settings`.
- Verify RSS, sitemap, article pages, and Pagefind after deployment.
