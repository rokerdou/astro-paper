import type { APIRoute } from "astro";
import { getDb } from "@/db";
import { posts, tags, postsTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { slugifyStr } from "@/utils/slugify";

export const prerender = false;

export const GET: APIRoute = async () => {
  const db = getDb();

  const allPosts = db.select().from(posts).all();
  const allTags = db.select().from(tags).all();
  const allPostsTags = db.select().from(postsTags).all();

  const tagMap = new Map(allTags.map(t => [t.id, { id: t.id, name: t.name, slug: t.slug }]));

  const postTagMap = new Map<number, typeof allTags>();
  for (const pt of allPostsTags) {
    const list = postTagMap.get(pt.postId) || [];
    const tag = tagMap.get(pt.tagId);
    if (tag) list.push(tag);
    postTagMap.set(pt.postId, list);
  }

  const result = allPosts.map(p => ({
    ...p,
    tags: postTagMap.get(p.id) || [],
  }));

  return new Response(JSON.stringify({ posts: result }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const db = getDb();
  const body = await request.json();

  const slug = body.slug || slugifyStr(body.title);
  const now = new Date().toISOString();

  const result = db.insert(posts).values({
    slug,
    title: body.title,
    description: body.description || "",
    body: body.body || "",
    author: body.author || "",
    pubDatetime: body.pubDatetime || now,
    modDatetime: null,
    featured: body.featured || false,
    draft: body.draft ?? true,
    ogImage: body.ogImage || null,
    coverImage: body.coverImage || null,
    canonicalUrl: body.canonicalUrl || null,
    hideEditPost: false,
    timezone: body.timezone || null,
    createdAt: now,
    updatedAt: now,
  }).returning().get();

  const tagNames: string[] = body.tags || [];
  const postTags: { id: number; name: string; slug: string }[] = [];

  for (const tagName of tagNames) {
    const tagSlug = slugifyStr(tagName);
    let tag = db.select().from(tags).where(eq(tags.slug, tagSlug)).get();
    if (!tag) {
      tag = db.insert(tags).values({ name: tagName, slug: tagSlug }).returning().get();
    }
    db.insert(postsTags).values({ postId: result.id, tagId: tag.id }).run();
    postTags.push({ id: tag.id, name: tag.name, slug: tag.slug });
  }

  return new Response(JSON.stringify({ post: { ...result, tags: postTags } }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
