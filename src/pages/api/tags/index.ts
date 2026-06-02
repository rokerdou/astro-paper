import type { APIRoute } from "astro";
import { findTagBySlug, createTag, listTags } from "@/db/d1";
import { getD1 } from "@/utils/cloudflare";
import { slugifyStr } from "@/utils/slugify";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const tags = await listTags(getD1(locals));
  return Response.json({ tags });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const db = getD1(locals);
  const body = await request.json();
  const name = body.name;
  const slug = slugifyStr(name);

  const existing = await findTagBySlug(db, slug);
  if (existing) {
    return Response.json({ tag: existing });
  }

  const tag = await createTag(db, name, slug);
  return Response.json({ tag }, { status: 201 });
};
