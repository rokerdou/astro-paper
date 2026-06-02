import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import { unified } from "unified";
import { slugifyStr } from "./slugify";

export interface RenderedHeading {
  depth: number;
  slug: string;
  text: string;
}

export interface RenderedPostContent {
  html: string;
  headings: RenderedHeading[];
  searchText: string;
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function extractHeadings(markdown: string) {
  const headings: RenderedHeading[] = [];
  const seen = new Map<string, number>();

  for (const line of markdown.split(/\r?\n/)) {
    const match = /^(#{2,4})\s+(.+)$/.exec(line);
    if (!match) continue;

    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;

    const baseSlug = slugifyStr(text);
    const count = seen.get(baseSlug) ?? 0;
    seen.set(baseSlug, count + 1);

    headings.push({
      depth: match[1].length,
      slug: count === 0 ? baseSlug : `${baseSlug}-${count}`,
      text,
    });
  }

  return headings;
}

function textContent(node: unknown): string {
  if (!node || typeof node !== "object") return "";

  if ("type" in node && node.type === "text" && "value" in node) {
    return String(node.value);
  }

  if ("children" in node && Array.isArray(node.children)) {
    return node.children.map(textContent).join("");
  }

  return "";
}

function rehypeHeadingIds() {
  const seen = new Map<string, number>();

  return (tree: unknown) => {
    function walk(node: unknown) {
      if (!node || typeof node !== "object") return;

      if (
        "type" in node &&
        node.type === "element" &&
        "tagName" in node &&
        typeof node.tagName === "string" &&
        /^h[2-4]$/.test(node.tagName)
      ) {
        const text = stripInlineMarkdown(textContent(node));
        const baseSlug = slugifyStr(text);
        const count = seen.get(baseSlug) ?? 0;
        seen.set(baseSlug, count + 1);

        const properties =
          "properties" in node && node.properties && typeof node.properties === "object"
            ? node.properties
            : {};
        Object.assign(node, {
          properties: {
            ...properties,
            id: count === 0 ? baseSlug : `${baseSlug}-${count}`,
          },
        });
      }

      if ("children" in node && Array.isArray(node.children)) {
        node.children.forEach(walk);
      }
    }

    walk(tree);
  };
}

function extractSearchText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[*_~#>-]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const processor = unified()
  .use(remarkParse)
  .use(remarkToc)
  .use(remarkCollapse, { test: "Table of contents" })
  .use(remarkRehype)
  .use(rehypeHeadingIds)
  .use(rehypeStringify);

export async function renderPostContent(
  markdown: string
): Promise<RenderedPostContent> {
  const file = await processor.process(markdown);

  return {
    html: String(file),
    headings: extractHeadings(markdown),
    searchText: extractSearchText(markdown),
  };
}
