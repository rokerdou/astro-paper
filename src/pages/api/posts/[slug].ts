import type { APIRoute } from "astro";
import {
  deletePostBySlug,
  getPostBySlug,
  getTagsForPost,
  getPostWithTags,
  refreshTagPostCounts,
  toApiPost,
  updatePostAndTags,
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

  const nextSlug = body.slug !== undefined ? slugifyStr(body.slug) : slug;
  if (!nextSlug) {
    return Response.json(
      { error: "Post URL slug is required" },
      { status: 400 }
    );
  }

  if (nextSlug !== slug) {
    const slugOwner = await getPostBySlug(db, nextSlug);
    if (slugOwner) {
      return Response.json(
        { error: "Post URL already exists" },
        { status: 409 }
      );
    }
  }

  const tagNames: string[] =
    body.tags === undefined
      ? []
      : Array.isArray(body.tags)
        ? body.tags.filter(
            (tag: unknown): tag is string => typeof tag === "string"
          )
        : [];
  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    return Response.json({ error: "Tags must be an array" }, { status: 400 });
  }
  if (Array.isArray(body.tags) && tagNames.length !== body.tags.length) {
    return Response.json({ error: "Tags must be strings" }, { status: 400 });
  }

  const rendered =
    body.body !== undefined
      ? await import("@/utils/renderPostContent").then(
          ({ renderPostContent }) => renderPostContent(body.body)
        )
      : null;
  const pubDatetime = body.pubDatetime ?? existing.pub_datetime;
  const modDatetime = body.modDatetime ?? existing.mod_datetime;

  const updates = {
    ...(nextSlug !== slug && { slug: nextSlug }),
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
  };

  const oldTags =
    body.tags !== undefined ? await getTagsForPost(db, existing.id) : [];
  const newTags =
    body.tags !== undefined
      ? await updatePostAndTags(
          db,
          slug,
          existing.id,
          updates,
          tagNames,
          slugifyStr
        )
      : [];

  if (body.tags === undefined) {
    await updatePostBySlug(db, slug, updates);
    await refreshTagPostCounts(db);
  }

  const updated = await getPostWithTags(db, nextSlug);
  await purgePublicCache(request, [
    `/posts/${slug}/`,
    `/posts/${nextSlug}/`,
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
