import { runHighlighterWithAstro } from "@astrojs/prism/dist/highlighter";
import { fromHtml } from "hast-util-from-html";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkCollapse from "remark-collapse";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkSmartypants from "remark-smartypants";
import remarkToc from "remark-toc";
import Slugger from "github-slugger";
import { unified } from "unified";

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

type HastNode = {
  type?: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function textContent(node: HastNode): string {
  if (node.type === "text" || node.type === "raw") return node.value ?? "";
  return node.children?.map(textContent).join("") ?? "";
}

function rehypeHeadingIds() {
  return (tree: HastNode, file: { data: { astro?: { headings?: RenderedHeading[] } } }) => {
    const headings: RenderedHeading[] = [];
    const slugger = new Slugger();

    function walk(node: HastNode) {
      if (node.type === "element" && node.tagName) {
        const match = /^h([2-4])$/.exec(node.tagName);
        if (match) {
          const depth = Number(match[1]);
          const text = textContent(node).trim();
          const properties = node.properties ?? {};
          const existingId = typeof properties.id === "string" ? properties.id : "";
          const slug = existingId || slugger.slug(text);

          node.properties = { ...properties, id: slug };
          headings.push({ depth, slug, text });
        }
      }

      node.children?.forEach(walk);
    }

    walk(tree);

    file.data.astro ??= {};
    file.data.astro.headings = headings;
  };
}

function rehypePrism() {
  return (tree: HastNode) => {
    function walk(node: HastNode, index?: number, parent?: HastNode) {
      if (node.tagName !== "pre" || !Array.isArray(node.children)) return;

      const code = node.children.find(child => child.tagName === "code");
      if (!code) return;

      const className = code.properties?.className;
      const classes = Array.isArray(className) ? className.map(String) : [];
      const languageClass = classes.find(value => value.startsWith("language-"));
      const language = languageClass?.replace("language-", "");
      if (!language) return;

      const highlighted = runHighlighterWithAstro(language, textContent(code));
      const fragment = fromHtml(
        `<pre class="${highlighted.classLanguage}" data-language="${language}"><code is:raw class="${highlighted.classLanguage}">${highlighted.html}</code></pre>`,
        { fragment: true }
      ) as HastNode;
      const replacement = fragment.children?.[0];

      if (replacement && parent?.children && typeof index === "number") {
        parent.children[index] = replacement;
      }
    }

    function visitNode(node: HastNode, index?: number, parent?: HastNode) {
      walk(node, index, parent);
      node.children?.forEach((child, childIndex) => visitNode(child, childIndex, node));
    }

    visitNode(tree);
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkSmartypants)
  .use(remarkToc)
  .use(remarkCollapse, { test: "Table of contents" })
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeHeadingIds)
  .use(rehypePrism)
  .use(rehypeStringify, { allowDangerousHtml: true });

function extractSearchText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[*_~#>|-]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function renderPostContent(
  markdown: string
): Promise<RenderedPostContent> {
  const file = await processor.process(markdown);

  return {
    html: String(file),
    headings: file.data.astro?.headings ?? [],
    searchText: extractSearchText(markdown),
  };
}
