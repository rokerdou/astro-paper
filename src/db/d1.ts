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
  sort_datetime: string;
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
  id: number;
  name: string;
  slug: string;
}

export interface PostWithTags extends PostRow {
  tags: TagRow[];
}

export interface TopTagRow extends TagRow {
  post_count: number;
}

export interface SearchPostRow {
  slug: string;
  title: string;
  description: string;
  search_text: string;
}

export interface SiteSettingRow {
  key: string;
  value: string;
  updated_at: string;
}

export type CommentStatus = "pending" | "approved" | "rejected";

export interface CommentRow {
  id: number;
  post_id: number;
  parent_id: number | null;
  author_name: string;
  author_email_hash: string | null;
  content: string;
  status: CommentStatus;
  created_at: string;
  updated_at: string;
}

export interface ModerationCommentRow extends CommentRow {
  post_slug: string;
  post_title: string;
}

export interface CommentInput {
  postId: number;
  parentId: number | null;
  authorName: string;
  authorEmailHash: string | null;
  content: string;
  status: CommentStatus;
  ipHash: string | null;
  userAgentHash: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toApiPost(
  post: PostRow | PostWithTags | PostSummaryRow,
  tags: TagRow[] = []
) {
  const fullPost = post as Partial<PostRow>;
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    description: post.description,
    body: fullPost.body,
    bodyHtml: fullPost.body_html,
    headings: fullPost.headings,
    searchText: fullPost.search_text,
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
  sortDatetime: string;
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

export async function listSiteSettings(db: D1Database) {
  const result = await db
    .prepare(
      "SELECT key, value, updated_at FROM site_settings ORDER BY key ASC"
    )
    .all<SiteSettingRow>();
  return result.results ?? [];
}

export async function replaceSiteSettings(
  db: D1Database,
  settings: Record<string, string>
) {
  const now = new Date().toISOString();
  const statements = Object.entries(settings).map(([key, value]) =>
    db
      .prepare(
        `INSERT INTO site_settings (key, value, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = excluded.updated_at`
      )
      .bind(key, value, now)
  );

  if (statements.length > 0) {
    await db.batch(statements);
  }
}

function nowWithScheduledMargin() {
  return new Date().toISOString();
}

function publishedWhere(includeDrafts?: boolean, prefix = "") {
  return includeDrafts
    ? ""
    : `WHERE ${prefix}draft = 0 AND ${prefix}pub_datetime <= ?`;
}

function publishedBindings(includeDrafts?: boolean) {
  return includeDrafts ? [] : [nowWithScheduledMargin()];
}

export async function listPostSummaries(
  db: D1Database,
  options: { includeDrafts?: boolean; limit?: number; offset?: number } = {}
) {
  const where = publishedWhere(options.includeDrafts);
  const limit = options.limit ? "LIMIT ?" : "";
  const offset = options.offset ? "OFFSET ?" : "";
  const statement = db.prepare(
    `SELECT
      id, slug, title, description, author, pub_datetime, mod_datetime,
      sort_datetime,
      featured, draft, og_image, cover_image, canonical_url, hide_edit_post,
      timezone, created_at, updated_at
     FROM posts
     ${where}
     ORDER BY sort_datetime DESC, id DESC
     ${limit}` + (offset ? ` ${offset}` : "")
  );

  const values = [
    ...publishedBindings(options.includeDrafts),
    ...(options.limit ? [options.limit] : []),
    ...(options.offset ? [options.offset] : []),
  ];
  const result =
    values.length > 0
      ? await statement.bind(...values).all<PostSummaryRow>()
      : await statement.all<PostSummaryRow>();

  return result.results ?? [];
}

export async function listArchivePostSummaries(db: D1Database) {
  const result = await db
    .prepare(
      `SELECT
        id, slug, title, description, author, pub_datetime, mod_datetime,
        sort_datetime,
        featured, draft, og_image, cover_image, canonical_url, hide_edit_post,
        timezone, created_at, updated_at
       FROM posts
       WHERE draft = 0
         AND pub_datetime <= ?
       ORDER BY pub_datetime DESC, id DESC`
    )
    .bind(nowWithScheduledMargin())
    .all<PostSummaryRow>();

  return result.results ?? [];
}

export async function countPostSummaries(
  db: D1Database,
  options: { includeDrafts?: boolean } = {}
) {
  const where = publishedWhere(options.includeDrafts);
  const statement = db.prepare(`SELECT COUNT(*) AS count FROM posts ${where}`);
  const row =
    publishedBindings(options.includeDrafts).length > 0
      ? await statement
          .bind(...publishedBindings(options.includeDrafts))
          .first<{ count: number }>()
      : await statement.first<{ count: number }>();
  return row?.count ?? 0;
}

export async function getPostStats(db: D1Database) {
  const row = await db
    .prepare(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN draft = 0 THEN 1 ELSE 0 END) AS published,
        SUM(CASE WHEN draft = 1 THEN 1 ELSE 0 END) AS drafts
       FROM posts`
    )
    .first<{
      total: number;
      published: number | null;
      drafts: number | null;
    }>();

  return {
    total: row?.total ?? 0,
    published: row?.published ?? 0,
    drafts: row?.drafts ?? 0,
  };
}

export async function listTags(db: D1Database) {
  const result = await db
    .prepare("SELECT * FROM tags ORDER BY name ASC")
    .all<TagRow>();
  return result.results ?? [];
}

export async function listPublishedTags(db: D1Database) {
  const result = await db
    .prepare(
      `SELECT tags.id, tags.name, tags.slug, tag_post_counts.post_count
       FROM tags
       INNER JOIN tag_post_counts ON tag_post_counts.tag_id = tags.id
       WHERE tag_post_counts.post_count > 0
       ORDER BY tags.name ASC`
    )
    .all<TopTagRow>();
  return result.results ?? [];
}

export async function listTopTags(db: D1Database, limit = 6) {
  const result = await db
    .prepare(
      `SELECT tags.id, tags.name, tags.slug, tag_post_counts.post_count
       FROM tags
       INNER JOIN tag_post_counts ON tag_post_counts.tag_id = tags.id
       WHERE tag_post_counts.post_count > 0
       ORDER BY tag_post_counts.post_count DESC, tags.name ASC
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

export async function listTagNamesForPostIds(
  db: D1Database,
  postIds: number[]
) {
  if (postIds.length === 0) return [];

  const placeholders = postIds.map(() => "?").join(", ");
  const result = await db
    .prepare(
      `SELECT posts_tags.post_id, tags.id, tags.name, tags.slug
       FROM posts_tags
       INNER JOIN tags ON tags.id = posts_tags.tag_id
       WHERE posts_tags.post_id IN (${placeholders})
       ORDER BY tags.name ASC`
    )
    .bind(...postIds)
    .all<PostTagNameRow>();

  return result.results ?? [];
}

export async function listPostSummariesByTag(
  db: D1Database,
  tagSlug: string,
  options: { limit?: number; offset?: number } = {}
) {
  const limit = options.limit ? "LIMIT ?" : "";
  const offset = options.offset ? "OFFSET ?" : "";
  const values: unknown[] = [tagSlug, nowWithScheduledMargin()];
  if (options.limit) values.push(options.limit);
  if (options.offset) values.push(options.offset);

  const result = await db
    .prepare(
      `SELECT
        posts.id, posts.slug, posts.title, posts.description, posts.author,
        posts.pub_datetime, posts.mod_datetime, posts.sort_datetime,
        posts.featured, posts.draft, posts.og_image, posts.cover_image,
        posts.canonical_url, posts.hide_edit_post, posts.timezone,
        posts.created_at, posts.updated_at
       FROM tags
       INNER JOIN posts_tags INDEXED BY idx_posts_tags_lookup
         ON posts_tags.tag_id = tags.id
       INNER JOIN posts ON posts.id = posts_tags.post_id
       WHERE tags.slug = ?
         AND posts.draft = 0
         AND posts.pub_datetime <= ?
       ORDER BY posts.sort_datetime DESC, posts.id DESC
       ${limit}` + (offset ? ` ${offset}` : "")
    )
    .bind(...values)
    .all<PostSummaryRow>();

  return result.results ?? [];
}

export async function countPostSummariesByTag(db: D1Database, tagSlug: string) {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS count
       FROM tags
       INNER JOIN posts_tags INDEXED BY idx_posts_tags_lookup
         ON posts_tags.tag_id = tags.id
       INNER JOIN posts ON posts.id = posts_tags.post_id
       WHERE tags.slug = ?
         AND posts.draft = 0
         AND posts.pub_datetime <= ?`
    )
    .bind(tagSlug, nowWithScheduledMargin())
    .first<{ count: number }>();

  return row?.count ?? 0;
}

export async function refreshTagPostCounts(db: D1Database) {
  const now = nowWithScheduledMargin();
  await db.batch(tagPostCountStatements(db, now));
}

function tagPostCountStatements(
  db: D1Database,
  now = nowWithScheduledMargin()
) {
  return [
    db.prepare("DELETE FROM tag_post_counts"),
    db
      .prepare(
        `INSERT INTO tag_post_counts (tag_id, post_count, updated_at)
         SELECT
           tags.id,
           COUNT(posts.id) AS post_count,
           ? AS updated_at
         FROM tags
         LEFT JOIN posts_tags ON posts_tags.tag_id = tags.id
         LEFT JOIN posts ON posts.id = posts_tags.post_id
           AND posts.draft = 0
           AND posts.pub_datetime <= ?
         GROUP BY tags.id`
      )
      .bind(now, now),
  ];
}

export async function getPostBySlug(db: D1Database, slug: string) {
  return db
    .prepare("SELECT * FROM posts WHERE slug = ?")
    .bind(slug)
    .first<PostRow>();
}

export async function getPublishedPostBySlug(db: D1Database, slug: string) {
  return db
    .prepare(
      `SELECT *
       FROM posts
       WHERE slug = ?
         AND draft = 0
         AND pub_datetime <= ?`
    )
    .bind(slug, nowWithScheduledMargin())
    .first<PostRow>();
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

export async function getAdjacentPostSummaries(
  db: D1Database,
  sortDatetime: string,
  id: number
) {
  const publishedAt = nowWithScheduledMargin();
  const previous = await db
    .prepare(
      `SELECT
        id, slug, title, description, author, pub_datetime, mod_datetime,
        sort_datetime, featured, draft, og_image, cover_image, canonical_url,
        hide_edit_post, timezone, created_at, updated_at
       FROM posts
       WHERE draft = 0
         AND pub_datetime <= ?
         AND (sort_datetime > ? OR (sort_datetime = ? AND id > ?))
       ORDER BY sort_datetime ASC, id ASC
       LIMIT 1`
    )
    .bind(publishedAt, sortDatetime, sortDatetime, id)
    .first<PostSummaryRow>();

  const next = await db
    .prepare(
      `SELECT
        id, slug, title, description, author, pub_datetime, mod_datetime,
        sort_datetime, featured, draft, og_image, cover_image, canonical_url,
        hide_edit_post, timezone, created_at, updated_at
       FROM posts
       WHERE draft = 0
         AND pub_datetime <= ?
         AND (sort_datetime < ? OR (sort_datetime = ? AND id < ?))
       ORDER BY sort_datetime DESC, id DESC
       LIMIT 1`
    )
    .bind(publishedAt, sortDatetime, sortDatetime, id)
    .first<PostSummaryRow>();

  return { previous, next };
}

export async function searchPublishedPosts(
  db: D1Database,
  query: string,
  limit = 20
) {
  const normalizedQuery = query.trim().replace(/\s+/g, " ");
  if (!normalizedQuery) return [];

  const escapedQuery = normalizedQuery.replace(
    /[\\%_]/g,
    value => `\\${value}`
  );
  const pattern = `%${escapedQuery}%`;

  const result = await db
    .prepare(
      `SELECT slug, title, description, search_text
       FROM posts
       WHERE draft = 0
         AND pub_datetime <= ?
         AND (
           title LIKE ? ESCAPE '\\'
           OR description LIKE ? ESCAPE '\\'
           OR search_text LIKE ? ESCAPE '\\'
         )
       ORDER BY
         CASE
           WHEN title LIKE ? ESCAPE '\\' THEN 0
           WHEN description LIKE ? ESCAPE '\\' THEN 1
           ELSE 2
         END,
         sort_datetime DESC,
         id DESC
       LIMIT ?`
    )
    .bind(
      nowWithScheduledMargin(),
      pattern,
      pattern,
      pattern,
      pattern,
      pattern,
      limit
    )
    .all<SearchPostRow>();

  return result.results ?? [];
}

export async function createPost(db: D1Database, input: PostInput) {
  return db
    .prepare(
      `INSERT INTO posts (
        slug, title, description, body, body_html, headings, search_text,
        author, pub_datetime, mod_datetime, sort_datetime,
        featured, draft, og_image, cover_image, canonical_url, hide_edit_post,
        timezone, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      input.sortDatetime,
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
  const statement = postUpdateStatement(db, slug, updates);
  if (!statement) return;
  await statement.run();
}

function postUpdateStatement(
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
  if (updates.description !== undefined)
    add("description", updates.description);
  if (updates.body !== undefined) add("body", updates.body);
  if (updates.bodyHtml !== undefined) add("body_html", updates.bodyHtml);
  if (updates.headings !== undefined) add("headings", updates.headings);
  if (updates.searchText !== undefined) add("search_text", updates.searchText);
  if (updates.slug !== undefined) add("slug", updates.slug);
  if (updates.author !== undefined) add("author", updates.author);
  if (updates.pubDatetime !== undefined)
    add("pub_datetime", updates.pubDatetime);
  if (updates.modDatetime !== undefined)
    add("mod_datetime", updates.modDatetime);
  if (updates.sortDatetime !== undefined)
    add("sort_datetime", updates.sortDatetime);
  if (updates.featured !== undefined)
    add("featured", boolToInt(updates.featured));
  if (updates.draft !== undefined) add("draft", boolToInt(updates.draft));
  if (updates.ogImage !== undefined) add("og_image", updates.ogImage);
  if (updates.coverImage !== undefined) add("cover_image", updates.coverImage);
  if (updates.canonicalUrl !== undefined)
    add("canonical_url", updates.canonicalUrl);
  if (updates.hideEditPost !== undefined) {
    add("hide_edit_post", boolToInt(updates.hideEditPost));
  }
  if (updates.timezone !== undefined) add("timezone", updates.timezone);
  if (updates.updatedAt !== undefined) add("updated_at", updates.updatedAt);

  if (fields.length === 0) return null;

  return db
    .prepare(`UPDATE posts SET ${fields.join(", ")} WHERE slug = ?`)
    .bind(...values, slug);
}

export async function deletePostBySlug(db: D1Database, slug: string) {
  return db.prepare("DELETE FROM posts WHERE slug = ?").bind(slug).run();
}

export async function findTagBySlug(db: D1Database, slug: string) {
  return db
    .prepare("SELECT * FROM tags WHERE slug = ?")
    .bind(slug)
    .first<TagRow>();
}

export async function createTag(db: D1Database, name: string, slug: string) {
  return db
    .prepare("INSERT INTO tags (name, slug) VALUES (?, ?) RETURNING *")
    .bind(name, slug)
    .first<TagRow>();
}

export async function getOrCreateTag(
  db: D1Database,
  name: string,
  slug: string
) {
  return (await findTagBySlug(db, slug)) ?? (await createTag(db, name, slug));
}

export async function replacePostTags(
  db: D1Database,
  postId: number,
  tagNames: string[],
  slugify: (tag: string) => string
) {
  await db
    .prepare("DELETE FROM posts_tags WHERE post_id = ?")
    .bind(postId)
    .run();

  const tags: TagRow[] = [];
  for (const tagName of tagNames) {
    const tag = await getOrCreateTag(db, tagName, slugify(tagName));
    if (!tag) continue;
    await db
      .prepare(
        "INSERT OR IGNORE INTO posts_tags (post_id, tag_id) VALUES (?, ?)"
      )
      .bind(postId, tag.id)
      .run();
    tags.push(tag);
  }

  return tags;
}

export async function updatePostAndTags(
  db: D1Database,
  slug: string,
  postId: number,
  updates: Partial<PostInput>,
  tagNames: string[],
  slugify: (tag: string) => string
) {
  const tags: TagRow[] = [];

  for (const tagName of tagNames) {
    const tag = await getOrCreateTag(db, tagName, slugify(tagName));
    if (tag) tags.push(tag);
  }

  const updateStatement = postUpdateStatement(db, slug, updates);
  const now = nowWithScheduledMargin();
  const statements = [
    ...(updateStatement ? [updateStatement] : []),
    db.prepare("DELETE FROM posts_tags WHERE post_id = ?").bind(postId),
    ...tags.map(tag =>
      db
        .prepare(
          "INSERT OR IGNORE INTO posts_tags (post_id, tag_id) VALUES (?, ?)"
        )
        .bind(postId, tag.id)
    ),
    ...tagPostCountStatements(db, now),
  ];

  await db.batch(statements);
  return tags;
}

function toApiComment(comment: CommentRow | ModerationCommentRow) {
  return {
    id: comment.id,
    parentId: comment.parent_id,
    postId: comment.post_id,
    postSlug: "post_slug" in comment ? comment.post_slug : undefined,
    postTitle: "post_title" in comment ? comment.post_title : undefined,
    authorName: comment.author_name,
    content: comment.content,
    status: comment.status,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
  };
}

export async function countApprovedTopLevelComments(
  db: D1Database,
  postId: number
) {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS count
       FROM comments
       WHERE post_id = ?
         AND status = 'approved'
         AND parent_id IS NULL`
    )
    .bind(postId)
    .first<{ count: number }>();

  return row?.count ?? 0;
}

export async function listApprovedCommentsForPost(
  db: D1Database,
  postId: number,
  options: { limit: number; offset: number }
) {
  const roots = await db
    .prepare(
      `SELECT
        id, post_id, parent_id, author_name, author_email_hash, content,
        status, created_at, updated_at
       FROM comments
       WHERE post_id = ?
         AND status = 'approved'
         AND parent_id IS NULL
       ORDER BY created_at DESC, id DESC
       LIMIT ? OFFSET ?`
    )
    .bind(postId, options.limit, options.offset)
    .all<CommentRow>();

  const rootRows = roots.results ?? [];
  if (rootRows.length === 0) return [];

  const rootIds = rootRows.map(comment => comment.id);
  const placeholders = rootIds.map(() => "?").join(", ");
  const replies = await db
    .prepare(
      `SELECT
        id, post_id, parent_id, author_name, author_email_hash, content,
        status, created_at, updated_at
       FROM comments
       WHERE post_id = ?
         AND status = 'approved'
         AND parent_id IN (${placeholders})
       ORDER BY created_at ASC, id ASC`
    )
    .bind(postId, ...rootIds)
    .all<CommentRow>();

  return [...rootRows, ...(replies.results ?? [])].map(toApiComment);
}

export async function createComment(db: D1Database, input: CommentInput) {
  return db
    .prepare(
      `INSERT INTO comments (
        post_id, parent_id, author_name, author_email_hash, content, status,
        ip_hash, user_agent_hash, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING
        id, post_id, parent_id, author_name, author_email_hash, content,
        status, created_at, updated_at`
    )
    .bind(
      input.postId,
      input.parentId,
      input.authorName,
      input.authorEmailHash,
      input.content,
      input.status,
      input.ipHash,
      input.userAgentHash,
      input.createdAt,
      input.updatedAt
    )
    .first<CommentRow>();
}

export async function getCommentForPost(
  db: D1Database,
  postId: number,
  commentId: number
) {
  return db
    .prepare(
      `SELECT
        id, post_id, parent_id, author_name, author_email_hash, content,
        status, created_at, updated_at
       FROM comments
       WHERE id = ?
         AND post_id = ?`
    )
    .bind(commentId, postId)
    .first<CommentRow>();
}

export async function countRecentCommentsByIp(
  db: D1Database,
  postId: number,
  ipHash: string,
  sinceIso: string
) {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS count
       FROM comments
       WHERE post_id = ?
         AND ip_hash = ?
         AND created_at >= ?`
    )
    .bind(postId, ipHash, sinceIso)
    .first<{ count: number }>();

  return row?.count ?? 0;
}

export async function listCommentsForModeration(
  db: D1Database,
  options: { status?: CommentStatus; limit: number; offset: number }
) {
  const where = options.status ? "WHERE comments.status = ?" : "";
  const values: unknown[] = [];
  if (options.status) values.push(options.status);
  values.push(options.limit, options.offset);

  const result = await db
    .prepare(
      `SELECT
        comments.id, comments.post_id, comments.parent_id,
        comments.author_name, comments.author_email_hash, comments.content,
        comments.status, comments.created_at, comments.updated_at,
        posts.slug AS post_slug,
        posts.title AS post_title
       FROM comments
       INNER JOIN posts ON posts.id = comments.post_id
       ${where}
       ORDER BY comments.created_at DESC, comments.id DESC
       LIMIT ? OFFSET ?`
    )
    .bind(...values)
    .all<ModerationCommentRow>();

  return (result.results ?? []).map(toApiComment);
}

export async function updateCommentStatus(
  db: D1Database,
  commentId: number,
  status: CommentStatus
) {
  const now = new Date().toISOString();
  return db
    .prepare(
      `UPDATE comments
       SET status = ?, updated_at = ?
       WHERE id = ?
       RETURNING
        id, post_id, parent_id, author_name, author_email_hash, content,
        status, created_at, updated_at`
    )
    .bind(status, now, commentId)
    .first<CommentRow>();
}

export async function deleteComment(db: D1Database, commentId: number) {
  return db.prepare("DELETE FROM comments WHERE id = ?").bind(commentId).run();
}
