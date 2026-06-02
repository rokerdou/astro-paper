import type { APIRoute } from "astro";
import { searchPublishedPosts } from "@/db/d1";
import { getD1 } from "@/utils/cloudflare";

export const prerender = false;

function createExcerpt(text: string, query: string) {
  const normalizedText = text.replace(/\s+/g, " ").trim();
  if (!normalizedText) return "";

  const index = normalizedText.toLowerCase().indexOf(query.toLowerCase());
  const start = Math.max(index === -1 ? 0 : index - 80, 0);
  const excerpt = normalizedText.slice(start, start + 220);
  return `${start > 0 ? "..." : ""}${excerpt}${start + 220 < normalizedText.length ? "..." : ""}`;
}

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim();
  const requestedLimit = Number(url.searchParams.get("limit") ?? "20");
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 50)
    : 20;

  if (query.length < 2) {
    return Response.json({ results: [] });
  }

  const rows = await searchPublishedPosts(getD1(locals), query, limit);

  return Response.json({
    results: rows.map(row => ({
      url: `/posts/${row.slug}/`,
      title: row.title,
      excerpt: createExcerpt(row.search_text || row.description, query),
    })),
  });
};
