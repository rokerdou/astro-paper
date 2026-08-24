import type { APIRoute } from "astro";
import {
  findTagBySlug,
  createTag,
  listTags,
  refreshTagPostCounts,
} from "@/db/d1";
import { getD1 } from "@/utils/cloudflare";
import { purgePublicCache } from "@/utils/cache";
import { slugifyStr } from "@/utils/slugify";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const tags = await listTags(getD1(locals));
  return Response.json({
    tags: tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      postCount: tag.post_count ?? 0,
    })),
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const db = getD1(locals);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const name =
    body &&
    typeof body === "object" &&
    "name" in body &&
    typeof body.name === "string"
      ? body.name.trim()
      : "";
  if (!name || name.length > 80) {
    return Response.json({ error: "Tag name is required" }, { status: 400 });
  }
  const slug = slugifyStr(name);

  const existing = await findTagBySlug(db, slug);
  if (existing) {
    const tags = await listTags(db);
    const existingWithCount = tags.find(tag => tag.slug === existing.slug);
    return Response.json({
      tag: {
        ...existing,
        postCount: existingWithCount?.post_count ?? 0,
      },
    });
  }

  const tag = await createTag(db, name, slug);
  await refreshTagPostCounts(db);
  await purgePublicCache(request, [`/tags/${slug}/`]);

  return Response.json({ tag: { ...tag, postCount: 0 } }, { status: 201 });
};
