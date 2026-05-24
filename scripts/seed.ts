import Database from "better-sqlite3";
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import kebabCase from "lodash.kebabcase";

const DB_PATH = path.resolve("content.db");
const BLOG_DIR = path.resolve("src/data/blog");

function slugifyStr(str: string) {
  return kebabCase(str);
}

function main() {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  const insertPost = db.prepare(`
    INSERT INTO posts (slug, title, description, body, author, pub_datetime, mod_datetime, featured, draft, og_image, cover_image, canonical_url, hide_edit_post, timezone, created_at, updated_at)
    VALUES (@slug, @title, @description, @body, @author, @pubDatetime, @modDatetime, @featured, @draft, @ogImage, @coverImage, @canonicalUrl, @hideEditPost, @timezone, @createdAt, @updatedAt)
  `);

  const findTagByName = db.prepare("SELECT id FROM tags WHERE name = ?");
  const findTagBySlug = db.prepare("SELECT id FROM tags WHERE slug = ?");
  const insertTag = db.prepare("INSERT INTO tags (name, slug) VALUES (@name, @slug)");
  const insertPostTag = db.prepare("INSERT INTO posts_tags (post_id, tag_id) VALUES (@postId, @tagId)");

  const seed = db.transaction(() => {
    let postCount = 0;
    let tagCount = 0;

    function walkDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          const raw = fs.readFileSync(fullPath, "utf-8");
          const { data, content } = matter(raw);

          const slug = data.slug || slugifyStr(path.basename(entry.name, ".md"));
          const tags: string[] = data.tags || ["others"];

          const now = new Date().toISOString();
          const result = insertPost.run({
            slug,
            title: data.title || "",
            description: data.description || "",
            body: content,
            author: data.author || "Sat Naing",
            pubDatetime: data.pubDatetime ? new Date(data.pubDatetime).toISOString() : new Date().toISOString(),
            modDatetime: data.modDatetime ? new Date(data.modDatetime).toISOString() : null,
            featured: data.featured ? 1 : 0,
            draft: data.draft ? 1 : 0,
            ogImage: typeof data.ogImage === "string" ? data.ogImage : (data.ogImage?.src || null),
            coverImage: data.coverImage || null,
            canonicalUrl: data.canonicalURL || null,
            hideEditPost: data.hideEditPost ? 1 : 0,
            timezone: data.timezone || null,
            createdAt: now,
            updatedAt: now,
          });

          const postId = Number(result.lastInsertRowid);

          for (const tagName of tags) {
            const tagSlug = slugifyStr(tagName);
            let tagRow = findTagByName.get(tagName) as { id: number } | undefined;
            if (!tagRow) {
              tagRow = findTagBySlug.get(tagSlug) as { id: number } | undefined;
            }
            if (!tagRow) {
              const tagResult = insertTag.run({ name: tagName, slug: slugifyStr(tagName) });
              tagRow = { id: Number(tagResult.lastInsertRowid) };
              tagCount++;
            }
            insertPostTag.run({ postId, tagId: tagRow.id });
          }

          postCount++;
          console.log(`  Migrated: ${slug}`);
        }
      }
    }

    walkDir(BLOG_DIR);
    console.log(`\nDone: ${postCount} posts, ${tagCount} new tags.`);
  });

  seed();
  db.close();
}

main();
