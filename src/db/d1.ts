export interface PostRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  body_html: string;
  headings: string;
  search_text: string;
  author: string;
  pub_datetime: string;
  mod_datetime: string | null;
  featured: number;
  draft: number;
  og_image: string | null;
  cover_image: string | null;
  canonical_url: string | null;
  hide_edit_post: number;
  timezone: string | null;
  created_at: string;
  updated_at: string;
}

export type PostSummaryRow = Omit<
  PostRow,
  "body" | "body_html" | "headings" | "search_text"
>;

export interface TagRow {
  id: number;
  name: string;
  slug: string;
}

export interface PostTagRow {
  post_id: number;
  tag_id: number;
}

export interface PostTagNameRow {
  post_id: number;
  name: string;
}

export interface PostWithTags extends PostRow {
  tags: TagRow[];
}

export interface TopTagRow extends TagRow {
  post_count: number;
}

export function toApiPost(post: PostRow | PostWithTags, tags: TagRow[] = []) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    description: post.description,
    body: post.body,
    bodyHtml: post.body_html,
    headings: post.headings,
    searchText: post.search_text,
    author: post.author,
    pubDatetime: post.pub_datetime,
    modDatetime: post.mod_datetime,
    featured: Boolean(post.featured),
    draft: Boolean(post.draft),
    ogImage: post.og_image,
    coverImage: post.cover_image,
    canonicalUrl: post.canonical_url,
    hideEditPost: Boolean(post.hide_edit_post),
    timezone: post.timezone,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    tags: "tags" in post ? post.tags : tags,
  };
}

export interface PostInput {
  slug: string;
  title: string;
  description: string;
  body: string;
  bodyHtml: string;
  headings: string;
  searchText: string;
  author: string;
  pubDatetime: string;
  modDatetime: string | null;
  featured: boolean;
  draft: boolean;
  ogImage: string | null;
  coverImage: string | null;
  canonicalUrl: string | null;
  hideEditPost: boolean;
  timezone: string | null;
  createdAt: string;
  updatedAt: string;
}

function boolToInt(value: boolean) {
  return value ? 1 : 0;
}

function rowToPostWithTags(post: PostRow, tags: TagRow[]): PostWithTags {
  return { ...post, tags };
}

export async function listPosts(db: D1Database) {
  const result = await db.prepare("SELECT * FROM posts").all<PostRow>();
  return result.results ?? [];
}

export async function listPostSummaries(
  db: D1Database,
  options: { includeDrafts?: boolean; limit?: number } = {}
) {
  const where = options.includeDrafts ? "" : "WHERE draft = 0";
  const limit = options.limit ? "LIMIT ?" : "";
  const statement = db.prepare(
    `SELECT
      id, slug, title, description, author, pub_datetime, mod_datetime,
      featured, draft, og_image, cover_image, canonical_url, hide_edit_post,
      timezone, created_at, updated_at
     FROM posts
     ${where}
     ORDER BY COALESCE(mod_datetime, pub_datetime) DESC
     ${limit}`
  );

  const result = options.limit
    ? await statement.bind(options.limit).all<PostSummaryRow>()
    : await statement.all<PostSummaryRow>();

  return result.results ?? [];
}

export async function listTags(db: D1Database) {
  const result = await db.prepare("SELECT * FROM tags ORDER BY name ASC").all<TagRow>();
  return result.results ?? [];
}

export async function listTopTags(db: D1Database, limit = 6) {
  const result = await db
    .prepare(
      `SELECT tags.id, tags.name, tags.slug, COUNT(posts_tags.post_id) AS post_count
       FROM tags
       INNER JOIN posts_tags ON posts_tags.tag_id = tags.id
       INNER JOIN posts ON posts.id = posts_tags.post_id
       WHERE posts.draft = 0
       GROUP BY tags.id, tags.name, tags.slug
       ORDER BY post_count DESC, tags.name ASC
       LIMIT ?`
    )
    .bind(limit)
    .all<TopTagRow>();

  return result.results ?? [];
}

export async function listPostTags(db: D1Database) {
  const result = await db.prepare("SELECT * FROM posts_tags").all<PostTagRow>();
  return result.results ?? [];
}

export async function listTagNamesForPostIds(db: D1Database, postIds: number[]) {
  if (postIds.length === 0) return [];

  const placeholders = postIds.map(() => "?").join(", ");
  const result = await db
    .prepare(
      `SELECT posts_tags.post_id, tags.name
       FROM posts_tags
       INNER JOIN tags ON tags.id = posts_tags.tag_id
       WHERE posts_tags.post_id IN (${placeholders})
       ORDER BY tags.name ASC`
    )
    .bind(...postIds)
    .all<PostTagNameRow>();

  return result.results ?? [];
}

export async function getPostBySlug(db: D1Database, slug: string) {
  return db.prepare("SELECT * FROM posts WHERE slug = ?").bind(slug).first<PostRow>();
}

export async function getTagsForPost(db: D1Database, postId: number) {
  const result = await db
    .prepare(
      `SELECT tags.*
       FROM tags
       INNER JOIN posts_tags ON posts_tags.tag_id = tags.id
       WHERE posts_tags.post_id = ?
       ORDER BY tags.name ASC`
    )
    .bind(postId)
    .all<TagRow>();

  return result.results ?? [];
}

export async function getPostWithTags(db: D1Database, slug: string) {
  const post = await getPostBySlug(db, slug);
  if (!post) return null;
  return rowToPostWithTags(post, await getTagsForPost(db, post.id));
}

export async function createPost(db: D1Database, input: PostInput) {
  return db
    .prepare(
      `INSERT INTO posts (
        slug, title, description, body, body_html, headings, search_text,
        author, pub_datetime, mod_datetime,
        featured, draft, og_image, cover_image, canonical_url, hide_edit_post,
        timezone, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *`
    )
    .bind(
      input.slug,
      input.title,
      input.description,
      input.body,
      input.bodyHtml,
      input.headings,
      input.searchText,
      input.author,
      input.pubDatetime,
      input.modDatetime,
      boolToInt(input.featured),
      boolToInt(input.draft),
      input.ogImage,
      input.coverImage,
      input.canonicalUrl,
      boolToInt(input.hideEditPost),
      input.timezone,
      input.createdAt,
      input.updatedAt
    )
    .first<PostRow>();
}

export async function updatePostBySlug(
  db: D1Database,
  slug: string,
  updates: Partial<PostInput>
) {
  const fields: string[] = [];
  const values: unknown[] = [];

  const add = (column: string, value: unknown) => {
    fields.push(`${column} = ?`);
    values.push(value);
  };

  if (updates.title !== undefined) add("title", updates.title);
  if (updates.description !== undefined) add("description", updates.description);
  if (updates.body !== undefined) add("body", updates.body);
  if (updates.bodyHtml !== undefined) add("body_html", updates.bodyHtml);
  if (updates.headings !== undefined) add("headings", updates.headings);
  if (updates.searchText !== undefined) add("search_text", updates.searchText);
  if (updates.author !== undefined) add("author", updates.author);
  if (updates.pubDatetime !== undefined) add("pub_datetime", updates.pubDatetime);
  if (updates.modDatetime !== undefined) add("mod_datetime", updates.modDatetime);
  if (updates.featured !== undefined) add("featured", boolToInt(updates.featured));
  if (updates.draft !== undefined) add("draft", boolToInt(updates.draft));
  if (updates.ogImage !== undefined) add("og_image", updates.ogImage);
  if (updates.coverImage !== undefined) add("cover_image", updates.coverImage);
  if (updates.canonicalUrl !== undefined) add("canonical_url", updates.canonicalUrl);
  if (updates.hideEditPost !== undefined) {
    add("hide_edit_post", boolToInt(updates.hideEditPost));
  }
  if (updates.timezone !== undefined) add("timezone", updates.timezone);
  if (updates.updatedAt !== undefined) add("updated_at", updates.updatedAt);

  if (fields.length === 0) return;

  await db
    .prepare(`UPDATE posts SET ${fields.join(", ")} WHERE slug = ?`)
    .bind(...values, slug)
    .run();
}

export async function deletePostBySlug(db: D1Database, slug: string) {
  return db.prepare("DELETE FROM posts WHERE slug = ?").bind(slug).run();
}

export async function findTagBySlug(db: D1Database, slug: string) {
  return db.prepare("SELECT * FROM tags WHERE slug = ?").bind(slug).first<TagRow>();
}

export async function createTag(db: D1Database, name: string, slug: string) {
  return db
    .prepare("INSERT INTO tags (name, slug) VALUES (?, ?) RETURNING *")
    .bind(name, slug)
    .first<TagRow>();
}

export async function getOrCreateTag(db: D1Database, name: string, slug: string) {
  return (await findTagBySlug(db, slug)) ?? (await createTag(db, name, slug));
}

export async function replacePostTags(
  db: D1Database,
  postId: number,
  tagNames: string[],
  slugify: (tag: string) => string
) {
  await db.prepare("DELETE FROM posts_tags WHERE post_id = ?").bind(postId).run();

  const tags: TagRow[] = [];
  for (const tagName of tagNames) {
    const tag = await getOrCreateTag(db, tagName, slugify(tagName));
    if (!tag) continue;
    await db
      .prepare("INSERT OR IGNORE INTO posts_tags (post_id, tag_id) VALUES (?, ?)")
      .bind(postId, tag.id)
      .run();
    tags.push(tag);
  }

  return tags;
}
