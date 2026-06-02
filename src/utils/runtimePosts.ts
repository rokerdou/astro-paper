import type { MarkdownHeading } from "astro";
import { SITE } from "@/config";
import {
  countPostSummaries,
  countPostSummariesByTag,
  findTagBySlug,
  getAdjacentPostSummaries,
  getPostWithTags,
  listArchivePostSummaries,
  listPublishedTags,
  listPostSummaries,
  listPostSummariesByTag,
  listTagNamesForPostIds,
  listTopTags,
  type PostRow,
  type PostSummaryRow,
} from "@/db/d1";
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
  dbId?: number;
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

function parseHeadings(value?: string): MarkdownHeading[] {
  if (!value) return [];
  try {
    return JSON.parse(value) as MarkdownHeading[];
  } catch {
    return [];
  }
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
  post: PostRow | PostSummaryRow,
  postTags: string[],
  rendered?: BlogPostEntry["rendered"]
): BlogPostEntry {
  const fullPost = post as Partial<PostRow>;
  return {
    dbId: post.id,
    id: post.slug,
    slug: post.slug,
    filePath: `src/data/blog/${post.slug}.md`,
    body: fullPost.body,
    rendered:
      rendered ??
      (fullPost.body_html
        ? {
            html: fullPost.body_html,
            metadata: { headings: parseHeadings(fullPost.headings) },
          }
        : undefined),
    data: {
      author: post.author || SITE.author,
      pubDatetime: new Date(post.pub_datetime),
      modDatetime: post.mod_datetime ? new Date(post.mod_datetime) : null,
      title: post.title,
      featured: Boolean(post.featured) || undefined,
      draft: Boolean(post.draft) || undefined,
      tags: postTags.length > 0 ? postTags : ["others"],
      ogImage: post.og_image || undefined,
      coverImage: post.cover_image || undefined,
      description: post.description,
      canonicalURL: post.canonical_url || undefined,
      hideEditPost: Boolean(post.hide_edit_post) || undefined,
      timezone: post.timezone || undefined,
    },
  };
}

async function getTagNamesByPostId(db: D1Database, postIds: number[]) {
  const postTags = await listTagNamesForPostIds(db, postIds);
  const postTagMap = new Map<number, string[]>();

  for (const row of postTags) {
    const postTagNames = postTagMap.get(row.post_id) ?? [];
    postTagNames.push(row.name);
    postTagMap.set(row.post_id, postTagNames);
  }

  return postTagMap;
}

export async function getRuntimePosts(
  db: D1Database,
  options: { includeDrafts?: boolean; limit?: number } = {}
) {
  const summaries = await listPostSummaries(db, options);
  const tagNamesByPostId = await getTagNamesByPostId(
    db,
    summaries.map(post => post.id)
  );
  const entries = summaries.map(post =>
    toEntry(post, tagNamesByPostId.get(post.id) ?? [])
  );

  return options.includeDrafts ? entries : entries.filter(isPostPublished);
}

export async function getRuntimeArchivePosts(db: D1Database) {
  const summaries = await listArchivePostSummaries(db);
  return summaries.map(post => toEntry(post, []));
}

async function attachTags(db: D1Database, summaries: PostSummaryRow[]) {
  const tagNamesByPostId = await getTagNamesByPostId(
    db,
    summaries.map(post => post.id)
  );

  return summaries.map(post => toEntry(post, tagNamesByPostId.get(post.id) ?? []));
}

function createRuntimePagination<T>(
  data: T[],
  total: number,
  currentPage: number,
  pageSize: number,
  basePath: string
) {
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const pageNumber = Math.min(Math.max(currentPage, 1), lastPage);
  const normalizedBase = basePath.endsWith("/")
    ? basePath.slice(0, -1)
    : basePath;
  const urlForPage = (page: number) =>
    page === 1 && normalizedBase.endsWith("/page")
      ? "/posts/"
      : page === 1
        ? `${normalizedBase}/`
        : `${normalizedBase}/${page}/`;

  return {
    data,
    currentPage: pageNumber,
    lastPage,
    url: {
      current: urlForPage(pageNumber),
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

export async function getRuntimePostPage(
  db: D1Database,
  currentPage: number,
  pageSize: number,
  basePath = "/posts/page"
) {
  const total = await countPostSummaries(db);
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const pageNumber = Math.min(Math.max(currentPage, 1), lastPage);
  const offset = (pageNumber - 1) * pageSize;
  const summaries = await listPostSummaries(db, { limit: pageSize, offset });

  return createRuntimePagination(
    await attachTags(db, summaries),
    total,
    pageNumber,
    pageSize,
    basePath
  );
}

export async function getRuntimeTagPostPage(
  db: D1Database,
  tag: string,
  currentPage: number,
  pageSize: number
) {
  const tagRow = await findTagBySlug(db, tag);
  if (!tagRow) return null;

  const total = await countPostSummariesByTag(db, tag);
  if (total === 0) return null;

  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const pageNumber = Math.min(Math.max(currentPage, 1), lastPage);
  const offset = (pageNumber - 1) * pageSize;
  const summaries = await listPostSummariesByTag(db, tag, { limit: pageSize, offset });

  return {
    tagName: tagRow.name,
    page: createRuntimePagination(
      await attachTags(db, summaries),
      total,
      pageNumber,
      pageSize,
      `/tags/${tag}`
    ),
  };
}

export async function getRuntimePost(db: D1Database, slug: string) {
  const post = await getPostWithTags(db, slug);
  if (!post) return null;

  const entry = toEntry(
    post,
    post.tags.map(tag => tag.name),
    undefined
  );

  return isPostPublished(entry) ? entry : null;
}

export async function getRuntimeAdjacentPosts(
  db: D1Database,
  post: BlogPostEntry
) {
  const adjacent = await getAdjacentPostSummaries(
    db,
    new Date(post.data.modDatetime ?? post.data.pubDatetime).toISOString(),
    post.dbId ?? 0
  );

  return {
    previous: adjacent.previous ? toEntry(adjacent.previous, []) : null,
    next: adjacent.next ? toEntry(adjacent.next, []) : null,
  };
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

export async function getRuntimeTopTags(db: D1Database, limit = 6) {
  return (await listTopTags(db, limit)).map(tag => ({
    tag: tag.slug,
    tagName: tag.name,
  }));
}

export async function getRuntimePublishedTags(db: D1Database) {
  return (await listPublishedTags(db)).map(tag => ({
    tag: tag.slug,
    tagName: tag.name,
  }));
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
