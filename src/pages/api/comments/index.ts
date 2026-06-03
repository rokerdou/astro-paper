import type { APIRoute } from "astro";
import { listCommentsForModeration, type CommentStatus } from "@/db/d1";
import { getD1 } from "@/utils/cloudflare";

export const prerender = false;

function parseStatus(value: string | null): CommentStatus | undefined {
  return value === "pending" || value === "approved" || value === "rejected"
    ? value
    : undefined;
}

export const GET: APIRoute = async ({ request, locals }) => {
  const db = getD1(locals);
  const url = new URL(request.url);
  const requestedPage = Number(url.searchParams.get("page") ?? "1");
  const requestedPageSize = Number(url.searchParams.get("pageSize") ?? "50");
  const page = Number.isFinite(requestedPage) ? Math.max(requestedPage, 1) : 1;
  const pageSize = Number.isFinite(requestedPageSize)
    ? Math.min(Math.max(requestedPageSize, 1), 100)
    : 50;
  const status = parseStatus(url.searchParams.get("status"));

  const comments = await listCommentsForModeration(db, {
    status,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return Response.json(
    { comments, pagination: { page, pageSize } },
    { headers: { "Cache-Control": "no-store" } }
  );
};
