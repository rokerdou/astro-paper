import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import type { MarkdownHeading } from "astro";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { posts, postsTags, tags } from "@/db/schema";
import { SITE } from "@/config";
import { transformerFileName } from "@/utils/transformers/fileName";
import { slugifyStr } from "./slugify";

export interface BlogPostData {
  author: string;
  pubDatetime: Date;
  modDatetime?: Date | null;
  title: string;
  featured?: boolean;
  draft?: boolean;
  tags: string[];
  ogImage?: string;
  coverImage?: string;
  description: string;
  canonicalURL?: string;
  hideEditPost?: boolean;
  timezone?: string;
}

export interface BlogPostEntry {
  id: string;
  slug: string;
  filePath?: string;
  body?: string;
  data: BlogPostData;
  rendered?: {
    html: string;
    metadata?: {
      headings?: MarkdownHeading[];
    };
  };
}

let markdownProcessor: Awaited<ReturnType<typeof createMarkdownProcessor>> | null =
  null;

async function renderMarkdown(content: string) {
  markdownProcessor ??= await createMarkdownProcessor({
    syntaxHighlight: "shiki",
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  });
  const { code, metadata } = await markdownProcessor.render(content);
  return { html: code, metadata };
}

function isPostPublished(post: BlogPostEntry) {
  const isPublishTimePassed =
    Date.now() >
    new Date(post.data.pubDatetime).getTime() - SITE.scheduledPostMargin;
  return !post.data.draft && (import.meta.env.DEV || isPublishTimePassed);
}

function sortPosts<T extends BlogPostEntry>(posts: T[]) {
  return posts.sort(
    (a, b) =>
      Math.floor(
        new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
      ) -
      Math.floor(
        new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
      )
  );
}

function toEntry(
  post: typeof posts.$inferSelect,
  postTags: string[],
  rendered?: BlogPostEntry["rendered"]
): BlogPostEntry {
  return {
    id: post.slug,
    slug: post.slug,
    filePath: `src/data/blog/${post.slug}.md`,
    body: post.body,
    rendered,
    data: {
      author: post.author || SITE.author,
      pubDatetime: new Date(post.pubDatetime),
      modDatetime: post.modDatetime ? new Date(post.modDatetime) : null,
      title: post.title,
      featured: post.featured || undefined,
      draft: post.draft || undefined,
      tags: postTags.length > 0 ? postTags : ["others"],
      ogImage: post.ogImage || undefined,
      coverImage: post.coverImage || undefined,
      description: post.description,
      canonicalURL: post.canonicalUrl || undefined,
      hideEditPost: post.hideEditPost || undefined,
      timezone: post.timezone || undefined,
    },
  };
}

function getTagNamesByPostId() {
  const db = getDb();
  const allTags = db.select().from(tags).orderBy(asc(tags.name)).all();
  const allPostsTags = db.select().from(postsTags).all();
  const tagMap = new Map(allTags.map(tag => [tag.id, tag.name]));
  const postTagMap = new Map<number, string[]>();

  for (const row of allPostsTags) {
    const tagName = tagMap.get(row.tagId);
    if (!tagName) continue;
    const postTagNames = postTagMap.get(row.postId) ?? [];
    postTagNames.push(tagName);
    postTagMap.set(row.postId, postTagNames);
  }

  return postTagMap;
}

export function getRuntimePosts(options: { includeDrafts?: boolean } = {}) {
  const db = getDb();
  const tagNamesByPostId = getTagNamesByPostId();
  const entries = db
    .select()
    .from(posts)
    .all()
    .map(post => toEntry(post, tagNamesByPostId.get(post.id) ?? []));

  return sortPosts(
    options.includeDrafts ? entries : entries.filter(isPostPublished)
  );
}

export async function getRuntimePost(slug: string) {
  const db = getDb();
  const post = db.select().from(posts).where(eq(posts.slug, slug)).get();
  if (!post) return null;

  const rows = db
    .select({ name: tags.name })
    .from(postsTags)
    .innerJoin(tags, eq(postsTags.tagId, tags.id))
    .where(eq(postsTags.postId, post.id))
    .orderBy(asc(tags.name))
    .all();

  const entry = toEntry(
    post,
    rows.map(row => row.name),
    await renderMarkdown(post.body)
  );

  return isPostPublished(entry) ? entry : null;
}

export function getRuntimeTags(posts: BlogPostEntry[]) {
  return posts
    .flatMap(post => post.data.tags)
    .map(tag => ({ tag: slugifyStr(tag), tagName: tag }))
    .filter(
      (value, index, self) =>
        self.findIndex(tag => tag.tag === value.tag) === index
    )
    .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));
}

export function getRuntimePostsByTag(posts: BlogPostEntry[], tag: string) {
  return sortPosts(
    posts.filter(post =>
      post.data.tags.map(tagName => slugifyStr(tagName)).includes(tag)
    )
  );
}

export function createRuntimePage<T>(
  data: T[],
  currentPage: number,
  pageSize: number,
  basePath: string
) {
  const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
  const pageNumber = Math.min(Math.max(currentPage, 1), lastPage);
  const start = (pageNumber - 1) * pageSize;
  const normalizedBase = basePath.endsWith("/")
    ? basePath.slice(0, -1)
    : basePath;
  const urlForPage = (page: number) =>
    page === 1 ? `${normalizedBase}/` : `${normalizedBase}/${page}/`;

  return {
    data: data.slice(start, start + pageSize),
    currentPage: pageNumber,
    lastPage,
    url: {
      current: pageNumber === 1 && normalizedBase.endsWith("/page")
        ? "/posts/"
        : urlForPage(pageNumber),
      prev:
        pageNumber > 1
          ? pageNumber === 2 && normalizedBase.endsWith("/page")
            ? "/posts/"
            : urlForPage(pageNumber - 1)
          : undefined,
      next: pageNumber < lastPage ? urlForPage(pageNumber + 1) : undefined,
    },
  };
}
