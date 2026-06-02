import type { APIRoute } from "astro";
import {
  createPost,
  listPosts,
  listPostTags,
  listTags,
  replacePostTags,
  toApiPost,
} from "@/db/d1";
import { getD1 } from "@/utils/cloudflare";
import { renderPostContent } from "@/utils/renderPostContent";
import { slugifyStr } from "@/utils/slugify";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const db = getD1(locals);
  const allPosts = await listPosts(db);
  const allTags = await listTags(db);
  const allPostsTags = await listPostTags(db);

  const tagMap = new Map(allTags.map(tag => [tag.id, tag]));
  const postTagMap = new Map<number, typeof allTags>();
  for (const row of allPostsTags) {
    const list = postTagMap.get(row.post_id) || [];
    const tag = tagMap.get(row.tag_id);
    if (tag) list.push(tag);
    postTagMap.set(row.post_id, list);
  }

  const result = allPosts.map(post =>
    toApiPost(post, postTagMap.get(post.id) || [])
  );

  return Response.json({ posts: result });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const db = getD1(locals);
  const body = await request.json();

  const slug = body.slug || slugifyStr(body.title);
  const now = new Date().toISOString();
  const sourceBody = body.body || "";
  const rendered = await renderPostContent(sourceBody);

  const post = await createPost(db, {
    slug,
    title: body.title,
    description: body.description || "",
    body: sourceBody,
    bodyHtml: rendered.html,
    headings: JSON.stringify(rendered.headings),
    searchText: rendered.searchText,
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
