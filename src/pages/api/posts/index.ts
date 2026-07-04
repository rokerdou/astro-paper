import type { APIRoute } from "astro";
import {
  createPostAndTags,
  getPostBySlug,
  getPostStats,
  listPostSummaries,
  listTagNamesForPostIds,
  toApiPost,
} from "@/db/d1";
import { getD1 } from "@/utils/cloudflare";
import { purgePublicCache } from "@/utils/cache";
import { slugifyStr } from "@/utils/slugify";
import {
  InputValidationError,
  optionalBoolean,
  optionalIsoDate,
  optionalString,
  optionalWebUrl,
  parseJsonObject,
  parseTags,
  requiredString,
} from "@/utils/inputValidation";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  const db = getD1(locals);
  const url = new URL(request.url);
  const requestedPage = Number(url.searchParams.get("page") ?? "1");
  const requestedPageSize = Number(url.searchParams.get("pageSize") ?? "50");
  const page = Number.isFinite(requestedPage) ? Math.max(requestedPage, 1) : 1;
  const pageSize = Number.isFinite(requestedPageSize)
    ? Math.min(Math.max(requestedPageSize, 1), 100)
    : 50;
  const offset = (page - 1) * pageSize;
  const [posts, stats] = await Promise.all([
    listPostSummaries(db, { includeDrafts: true, limit: pageSize, offset }),
    getPostStats(db),
  ]);
  const postTags = await listTagNamesForPostIds(
    db,
    posts.map(post => post.id)
  );

  const postTagMap = new Map<
    number,
    { id: number; name: string; slug: string }[]
  >();
  for (const row of postTags) {
    const list = postTagMap.get(row.post_id) || [];
    list.push({
      id: row.id,
      name: row.name,
      slug: row.slug,
    });
    postTagMap.set(row.post_id, list);
  }

  const result = posts.map(post =>
    toApiPost(post, postTagMap.get(post.id) || [])
  );

  return Response.json({
    posts: result,
    pagination: {
      page,
      pageSize,
      total: stats.total,
      lastPage: Math.max(1, Math.ceil(stats.total / pageSize)),
    },
    stats,
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const db = getD1(locals);
  let body: Record<string, unknown>;
  try {
    body = parseJsonObject(await request.json());
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Invalid JSON body" },
      { status: 400 }
    );
  }

  try {
    body.title = requiredString(body.title, "Title", 160);
    body.description =
      optionalString(body.description, "Description", 320) ?? "";
    body.body = optionalString(body.body, "Body", 1_000_000) ?? "";
    body.author = optionalString(body.author, "Author", 120) ?? "";
    body.pubDatetime = optionalIsoDate(body.pubDatetime, "Publication date");
    body.featured = optionalBoolean(body.featured, "Featured") ?? false;
    body.draft = optionalBoolean(body.draft, "Draft") ?? true;
    body.ogImage = optionalWebUrl(body.ogImage, "OG image");
    body.coverImage = optionalWebUrl(body.coverImage, "Cover image");
    body.canonicalUrl = optionalWebUrl(body.canonicalUrl, "Canonical URL");
    body.tags = parseTags(body.tags) ?? [];
  } catch (error) {
    const message =
      error instanceof InputValidationError ? error.message : "Invalid post";
    return Response.json({ error: message }, { status: 400 });
  }

  const title = body.title as string;
  const description = body.description as string;
  const sourceBody = body.body as string;
  const author = body.author as string;
  const pubDatetime =
    (body.pubDatetime as string | undefined) ?? new Date().toISOString();
  const featured = body.featured as boolean;
  const draft = body.draft as boolean;
  const ogImage = body.ogImage as string | null;
  const coverImage = body.coverImage as string | null;
  const canonicalUrl = body.canonicalUrl as string | null;

  const slug = slugifyStr(typeof body.slug === "string" ? body.slug : title);
  if (!slug) {
    return Response.json(
      { error: "Post URL slug is required" },
      { status: 400 }
    );
  }

  const existing = await getPostBySlug(db, slug);
  if (existing) {
    return Response.json({ error: "Post URL already exists" }, { status: 409 });
  }

  const now = new Date().toISOString();
  const tagNames = body.tags as string[];

  const { renderPostContent } = await import("@/utils/renderPostContent");
  const rendered = await renderPostContent(sourceBody);
  const modDatetime = null;

  const created = await createPostAndTags(
    db,
    {
      slug,
      title,
      description,
      body: sourceBody,
      bodyHtml: rendered.html,
      headings: JSON.stringify(rendered.headings),
      searchText: rendered.searchText,
      author,
      pubDatetime,
      modDatetime,
      sortDatetime: modDatetime || pubDatetime,
      featured,
      draft,
      ogImage,
      coverImage,
      canonicalUrl,
      hideEditPost: false,
      timezone: typeof body.timezone === "string" ? body.timezone : null,
      createdAt: now,
      updatedAt: now,
    },
    tagNames,
    slugifyStr
  );
  const post = created.post;

  if (!post) {
    return Response.json({ error: "Unable to create post" }, { status: 500 });
  }

  const postTags = created.tags;
  await purgePublicCache(request, [
    `/posts/${slug}/`,
    ...postTags.map(tag => `/tags/${tag.slug}/`),
  ]);

  return Response.json({ post: toApiPost(post, postTags) }, { status: 201 });
};
