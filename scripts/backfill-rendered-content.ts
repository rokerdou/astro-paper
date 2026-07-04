/* eslint-disable no-console */
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import kebabCase from "lodash.kebabcase";
import { renderPostContent } from "../src/utils/renderPostContent";

const BLOG_DIR = path.resolve("src/data/blog");
const OUT_FILE = path.resolve("src/db/backfill-rendered-content.sql");

function slugifyStr(str: string) {
  return kebabCase(str);
}

function sqlString(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

async function main() {
  const statements: string[] = ["PRAGMA foreign_keys = ON;"];

  async function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walkDir(fullPath);
        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(raw);
      const slug = data.slug || slugifyStr(path.basename(entry.name, ".md"));
      const rendered = await renderPostContent(content);

      statements.push(
        [
          "UPDATE posts",
          `SET body_html = ${sqlString(rendered.html)},`,
          `headings = ${sqlString(JSON.stringify(rendered.headings))},`,
          `search_text = ${sqlString(rendered.searchText)}`,
          `WHERE slug = ${sqlString(slug)};`,
        ].join(" ")
      );

      console.log(`Prepared backfill: ${slug}`);
    }
  }

  await walkDir(BLOG_DIR);
  fs.writeFileSync(OUT_FILE, `${statements.join("\n")}\n`);
  console.log(`\nWrote ${OUT_FILE}`);
}

await main();
