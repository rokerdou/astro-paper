import type { APIRoute } from "astro";
import {
  deletePostAndRefreshCounts,
  getPostBySlug,
  getTagsForPost,
  getPostWithTags,
  refreshTagPostCounts,
  toApiPost,
  updatePostAndTags,
  updatePostBySlug,
  type PostInput,
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
} from "@/utils/inputValidation";

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
  let body: Record<string, unknown>;
  try {
    body = parseJsonObject(await request.json());
    if (body.title !== undefined)
      body.title = optionalString(body.title, "Title", 160);
    if (body.description !== undefined)
      body.description = optionalString(body.description, "Description", 320);
    if (body.body !== undefined)
      body.body = optionalString(body.body, "Body", 1_000_000);
    if (body.author !== undefined)
      body.author = optionalString(body.author, "Author", 120);
    if (body.pubDatetime !== undefined)
      body.pubDatetime = optionalIsoDate(body.pubDatetime, "Publication date");
    if (body.modDatetime !== undefined)
      body.modDatetime = optionalIsoDate(body.modDatetime, "Modified date");
    if (body.featured !== undefined)
      body.featured = optionalBoolean(body.featured, "Featured");
    if (body.draft !== undefined)
      body.draft = optionalBoolean(body.draft, "Draft");
    if (body.ogImage !== undefined)
      body.ogImage = optionalWebUrl(body.ogImage, "OG image");
    if (body.coverImage !== undefined)
      body.coverImage = optionalWebUrl(body.coverImage, "Cover image");
    if (body.canonicalUrl !== undefined)
      body.canonicalUrl = optionalWebUrl(body.canonicalUrl, "Canonical URL");
    if (body.tags !== undefined) body.tags = parseTags(body.tags);
  } catch (error) {
    const message =
      error instanceof InputValidationError
        ? error.message
        : "Invalid JSON body";
    return Response.json({ error: message }, { status: 400 });
  }
  const now = new Date().toISOString();

  const existing = await getPostBySlug(db, slug);
  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const nextSlug =
    body.slug !== undefined
      ? slugifyStr(typeof body.slug === "string" ? body.slug : "")
      : slug;
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

  const tagNames = (body.tags as string[] | undefined) ?? [];

  const rendered =
    body.body !== undefined
      ? await import("@/utils/renderPostContent").then(
          ({ renderPostContent }) => renderPostContent(body.body as string)
        )
      : null;
  const pubDatetime =
    (body.pubDatetime as string | undefined) ?? existing.pub_datetime;
  const modDatetime =
    body.modDatetime !== undefined
      ? (body.modDatetime as string | null)
      : existing.mod_datetime;

  const updates: Partial<PostInput> = {
    ...(nextSlug !== slug && { slug: nextSlug }),
    ...(body.title !== undefined && { title: body.title as string }),
    ...(body.description !== undefined && {
      description: body.description as string,
    }),
    ...(body.body !== undefined && { body: body.body as string }),
    ...(rendered && {
      bodyHtml: rendered.html,
      headings: JSON.stringify(rendered.headings),
      searchText: rendered.searchText,
    }),
    ...(body.author !== undefined && { author: body.author as string }),
    ...(body.pubDatetime !== undefined && {
      pubDatetime: body.pubDatetime as string,
    }),
    ...(body.modDatetime !== undefined && {
      modDatetime: body.modDatetime as string | null,
    }),
    ...((body.pubDatetime !== undefined || body.modDatetime !== undefined) && {
      sortDatetime: modDatetime || pubDatetime,
    }),
    ...(body.featured !== undefined && { featured: body.featured as boolean }),
    ...(body.draft !== undefined && { draft: body.draft as boolean }),
    ...(body.ogImage !== undefined && {
      ogImage: body.ogImage as string | null,
    }),
    ...(body.coverImage !== undefined && {
      coverImage: body.coverImage as string | null,
    }),
    ...(body.canonicalUrl !== undefined && {
      canonicalUrl: body.canonicalUrl as string | null,
    }),
    ...(body.timezone !== undefined && {
      timezone: body.timezone as string | null,
    }),
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
    if (body.draft !== undefined || body.pubDatetime !== undefined) {
      await refreshTagPostCounts(db);
    }
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
  await deletePostAndRefreshCounts(db, slug);
  await purgePublicCache(request, [
    `/posts/${slug}/`,
    ...oldTags.map(tag => `/tags/${tag.slug}/`),
  ]);

  return Response.json({ success: true });
};
