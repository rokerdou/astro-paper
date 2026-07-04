/* eslint-disable no-console */
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import kebabCase from "lodash.kebabcase";
import { renderPostContent } from "../src/utils/renderPostContent";

const BLOG_DIR = path.resolve("src/data/blog");
const OUT_FILE = path.resolve("src/db/seed.sql");

function slugifyStr(str: string) {
  return kebabCase(str);
}

function sqlString(value: string | null) {
  if (value === null) return "NULL";
  return `'${value.replaceAll("'", "''")}'`;
}

async function main() {
  const statements: string[] = [
    "PRAGMA foreign_keys = ON;",
    "DELETE FROM posts_tags;",
    "DELETE FROM posts;",
    "DELETE FROM tags;",
  ];
  const knownTags = new Set<string>();

  async function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walkDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const raw = fs.readFileSync(fullPath, "utf-8");
        const { data, content } = matter(raw);
        const slug = data.slug || slugifyStr(path.basename(entry.name, ".md"));
        const tagNames: string[] = data.tags || ["others"];
        const now = new Date().toISOString();
        const rendered = await renderPostContent(content);
        const pubDatetime = data.pubDatetime ? new Date(data.pubDatetime).toISOString() : now;
        const modDatetime = data.modDatetime ? new Date(data.modDatetime).toISOString() : null;
        const values = [
          sqlString(slug),
          sqlString(data.title || ""),
          sqlString(data.description || ""),
          sqlString(content),
          sqlString(rendered.html),
          sqlString(JSON.stringify(rendered.headings)),
          sqlString(rendered.searchText),
          sqlString(data.author || "Sat Naing"),
          sqlString(pubDatetime),
          sqlString(modDatetime),
          sqlString(modDatetime || pubDatetime),
          data.featured ? "1" : "0",
          data.draft ? "1" : "0",
          sqlString(typeof data.ogImage === "string" ? data.ogImage : data.ogImage?.src || null),
          sqlString(data.coverImage || null),
          sqlString(data.canonicalURL || null),
          data.hideEditPost ? "1" : "0",
          sqlString(data.timezone || null),
          sqlString(now),
          sqlString(now),
        ];

        statements.push(
          `INSERT INTO posts (slug, title, description, body, body_html, headings, search_text, author, pub_datetime, mod_datetime, sort_datetime, featured, draft, og_image, cover_image, canonical_url, hide_edit_post, timezone, created_at, updated_at) VALUES (${values.join(", ")});`
        );

        for (const tagName of tagNames) {
          const tagSlug = slugifyStr(tagName);
          if (!knownTags.has(tagSlug)) {
            statements.push(
              `INSERT OR IGNORE INTO tags (name, slug) VALUES (${sqlString(tagName)}, ${sqlString(tagSlug)});`
            );
            knownTags.add(tagSlug);
          }
          statements.push(
            `INSERT OR IGNORE INTO posts_tags (post_id, tag_id) SELECT posts.id, tags.id FROM posts, tags WHERE posts.slug = ${sqlString(slug)} AND tags.slug = ${sqlString(tagSlug)};`
          );
        }

        console.log(`Prepared: ${slug}`);
      }
    }
  }

  await walkDir(BLOG_DIR);
  fs.writeFileSync(OUT_FILE, `${statements.join("\n")}\n`);
  console.log(`\nWrote ${OUT_FILE}`);
}

await main();
