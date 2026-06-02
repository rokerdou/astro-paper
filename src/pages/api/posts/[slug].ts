import type { APIRoute } from "astro";
import {
  deletePostBySlug,
  getPostBySlug,
  getTagsForPost,
  getPostWithTags,
  refreshTagPostCounts,
  replacePostTags,
  toApiPost,
  updatePostBySlug,
} from "@/db/d1";
import { getD1 } from "@/utils/cloudflare";
import { purgePublicCache } from "@/utils/cache";
import { slugifyStr } from "@/utils/slugify";

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  const db = getD1(locals);
  const post = await getPostWithTags(db, params.slug!);
  if (!post) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ post: toApiPost(post) });
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const db = getD1(locals);
  const slug = params.slug!;
  const body = await request.json();
  const now = new Date().toISOString();

  const existing = await getPostBySlug(db, slug);
  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const rendered = body.body !== undefined
    ? await import("@/utils/renderPostContent").then(({ renderPostContent }) =>
        renderPostContent(body.body)
      )
    : null;
  const pubDatetime = body.pubDatetime ?? existing.pub_datetime;
  const modDatetime = body.modDatetime ?? existing.mod_datetime;

  await updatePostBySlug(db, slug, {
    ...(body.title !== undefined && { title: body.title }),
    ...(body.description !== undefined && { description: body.description }),
    ...(body.body !== undefined && { body: body.body }),
    ...(rendered && {
      bodyHtml: rendered.html,
      headings: JSON.stringify(rendered.headings),
      searchText: rendered.searchText,
    }),
    ...(body.author !== undefined && { author: body.author }),
    ...(body.pubDatetime !== undefined && { pubDatetime: body.pubDatetime }),
    ...(body.modDatetime !== undefined && { modDatetime: body.modDatetime }),
    ...((body.pubDatetime !== undefined || body.modDatetime !== undefined) && {
      sortDatetime: modDatetime || pubDatetime,
    }),
    ...(body.featured !== undefined && { featured: body.featured }),
    ...(body.draft !== undefined && { draft: body.draft }),
    ...(body.ogImage !== undefined && { ogImage: body.ogImage }),
    ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
    ...(body.canonicalUrl !== undefined && { canonicalUrl: body.canonicalUrl }),
    ...(body.timezone !== undefined && { timezone: body.timezone }),
    updatedAt: now,
  });

  const oldTags = body.tags !== undefined ? await getTagsForPost(db, existing.id) : [];
  const newTags =
    body.tags !== undefined
      ? await replacePostTags(db, existing.id, body.tags, slugifyStr)
      : [];

  const updated = await getPostWithTags(db, slug);
  await refreshTagPostCounts(db);
  await purgePublicCache(request, [
    `/posts/${slug}/`,
    ...oldTags.map(tag => `/tags/${tag.slug}/`),
    ...newTags.map(tag => `/tags/${tag.slug}/`),
  ]);

  return Response.json({ post: updated ? toApiPost(updated) : null });
};

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  const db = getD1(locals);
  const slug = params.slug!;

  const existing = await getPostBySlug(db, slug);
  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const oldTags = await getTagsForPost(db, existing.id);
  await deletePostBySlug(db, slug);
  await refreshTagPostCounts(db);
  await purgePublicCache(request, [
    `/posts/${slug}/`,
    ...oldTags.map(tag => `/tags/${tag.slug}/`),
  ]);

  return Response.json({ success: true });
};
