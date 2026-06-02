import type { APIRoute } from "astro";
import {
  createPost,
  getPostStats,
  listPostSummaries,
  listTagNamesForPostIds,
  replacePostTags,
  toApiPost,
} from "@/db/d1";
import { getD1 } from "@/utils/cloudflare";
import { renderPostContent } from "@/utils/renderPostContent";
import { slugifyStr } from "@/utils/slugify";

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

  const postTagMap = new Map<number, { id: number; name: string; slug: string }[]>();
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
  const body = await request.json();

  const slug = body.slug || slugifyStr(body.title);
  const now = new Date().toISOString();
  const sourceBody = body.body || "";
  const rendered = await renderPostContent(sourceBody);
  const pubDatetime = body.pubDatetime || now;
  const modDatetime = null;

  const post = await createPost(db, {
    slug,
    title: body.title,
    description: body.description || "",
    body: sourceBody,
    bodyHtml: rendered.html,
    headings: JSON.stringify(rendered.headings),
    searchText: rendered.searchText,
    author: body.author || "",
    pubDatetime,
    modDatetime,
    sortDatetime: modDatetime || pubDatetime,
    featured: body.featured || false,
    draft: body.draft ?? true,
    ogImage: body.ogImage || null,
    coverImage: body.coverImage || null,
    canonicalUrl: body.canonicalUrl || null,
    hideEditPost: false,
    timezone: body.timezone || null,
    createdAt: now,
    updatedAt: now,
  });

  if (!post) {
    return Response.json({ error: "Unable to create post" }, { status: 500 });
  }

  const tagNames: string[] = body.tags || [];
  const postTags = await replacePostTags(db, post.id, tagNames, slugifyStr);

  return Response.json(
    { post: toApiPost(post, postTags) },
    { status: 201 }
  );
};
