import type { APIRoute } from "astro";
import { getDb } from "@/db";
import { posts, tags, postsTags } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { slugifyStr } from "@/utils/slugify";

export const prerender = false;

function getPostWithTags(db: ReturnType<typeof getDb>, slug: string) {
  const post = db.select().from(posts).where(eq(posts.slug, slug)).get();
  if (!post) return null;

  const rows = db
    .select({ tagId: postsTags.tagId })
    .from(postsTags)
    .where(eq(postsTags.postId, post.id))
    .all();

  const postTagList: { id: number; name: string; slug: string }[] = [];
  for (const row of rows) {
    const tag = db.select().from(tags).where(eq(tags.id, row.tagId)).get();
    if (tag) postTagList.push({ id: tag.id, name: tag.name, slug: tag.slug });
  }

  return { ...post, tags: postTagList };
}

export const GET: APIRoute = async ({ params }) => {
  const db = getDb();
  const post = getPostWithTags(db, params.slug!);
  if (!post) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }
  return new Response(JSON.stringify({ post }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const db = getDb();
  const slug = params.slug!;
  const body = await request.json();
  const now = new Date().toISOString();

  const existing = db.select().from(posts).where(eq(posts.slug, slug)).get();
  if (!existing) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }

  db.update(posts)
    .set({
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.body !== undefined && { body: body.body }),
      ...(body.author !== undefined && { author: body.author }),
      ...(body.pubDatetime !== undefined && { pubDatetime: body.pubDatetime }),
      ...(body.modDatetime !== undefined && { modDatetime: body.modDatetime }),
      ...(body.featured !== undefined && { featured: body.featured }),
      ...(body.draft !== undefined && { draft: body.draft }),
      ...(body.ogImage !== undefined && { ogImage: body.ogImage }),
      ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
      ...(body.canonicalUrl !== undefined && { canonicalUrl: body.canonicalUrl }),
      ...(body.timezone !== undefined && { timezone: body.timezone }),
      updatedAt: now,
    })
    .where(eq(posts.slug, slug))
    .run();

  if (body.tags !== undefined) {
    db.delete(postsTags).where(eq(postsTags.postId, existing.id)).run();

    for (const tagName of body.tags) {
      const tagSlug = slugifyStr(tagName);
      let tag = db.select().from(tags).where(eq(tags.slug, tagSlug)).get();
      if (!tag) {
        tag = db.insert(tags).values({ name: tagName, slug: tagSlug }).returning().get();
      }
      db.insert(postsTags).values({ postId: existing.id, tagId: tag.id }).run();
    }
  }

  const updated = getPostWithTags(db, slug);
  return new Response(JSON.stringify({ post: updated }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ params }) => {
  const db = getDb();
  const slug = params.slug!;

  const existing = db.select().from(posts).where(eq(posts.slug, slug)).get();
  if (!existing) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }

  db.delete(posts).where(eq(posts.slug, slug)).run();

  return new Response(JSON.stringify({ success: true }));
};
