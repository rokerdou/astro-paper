import type { APIRoute } from "astro";
import { getDb } from "@/db";
import { tags } from "@/db/schema";
import { slugifyStr } from "@/utils/slugify";
import { eq } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async () => {
  const db = getDb();
  const allTags = db.select().from(tags).all();
  return new Response(JSON.stringify({ tags: allTags }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const db = getDb();
  const body = await request.json();
  const name = body.name;
  const slug = slugifyStr(name);

  const existing = db.select().from(tags).where(eq(tags.slug, slug)).get();

  if (existing) {
    return new Response(JSON.stringify({ tag: existing }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const tag = db.insert(tags).values({ name, slug }).returning().get();
  return new Response(JSON.stringify({ tag }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
