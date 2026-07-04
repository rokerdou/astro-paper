import type { APIRoute } from "astro";
import {
  countApprovedTopLevelComments,
  countRecentCommentsByIp,
  createComment,
  getCommentForPost,
  getPublishedPostBySlug,
  listApprovedCommentsForPost,
} from "@/db/d1";
import { getD1, type CloudflareLocals } from "@/utils/cloudflare";

export const prerender = false;

const MIN_CONTENT_LENGTH = 2;
const MAX_CONTENT_LENGTH = 2000;
const MAX_AUTHOR_LENGTH = 80;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getIpAddress(request: Request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export const GET: APIRoute = async ({ params, request, locals }) => {
  const db = getD1(locals);
  const slug = params.slug!;
  const post = await getPublishedPostBySlug(db, slug);
  if (!post) return jsonError("Post not found", 404);

  const url = new URL(request.url);
  const requestedPage = Number(url.searchParams.get("page") ?? "1");
  const requestedPageSize = Number(url.searchParams.get("pageSize") ?? "20");
  const page = Number.isFinite(requestedPage) ? Math.max(requestedPage, 1) : 1;
  const pageSize = Number.isFinite(requestedPageSize)
    ? Math.min(Math.max(requestedPageSize, 1), 50)
    : 20;
  const offset = (page - 1) * pageSize;

  const [comments, total] = await Promise.all([
    listApprovedCommentsForPost(db, post.id, { limit: pageSize, offset }),
    countApprovedTopLevelComments(db, post.id),
  ]);

  return Response.json(
    {
      comments,
      pagination: {
        page,
        pageSize,
        total,
        lastPage: Math.max(1, Math.ceil(total / pageSize)),
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
};

export const POST: APIRoute = async ({ params, request, locals }) => {
  if (!isSameOrigin(request)) {
    return jsonError("Invalid request origin", 403);
  }

  const db = getD1(locals);
  const slug = params.slug!;
  const post = await getPublishedPostBySlug(db, slug);
  if (!post) return jsonError("Post not found", 404);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const authorName = normalizeString(body.authorName);
  const authorEmail = normalizeString(body.authorEmail).toLowerCase();
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const parentId =
    typeof body.parentId === "number" && Number.isInteger(body.parentId)
      ? body.parentId
      : null;

  if (!authorName || authorName.length > MAX_AUTHOR_LENGTH) {
    return jsonError(
      "Author name is required and must be shorter than 80 characters"
    );
  }
  if (
    content.length < MIN_CONTENT_LENGTH ||
    content.length > MAX_CONTENT_LENGTH
  ) {
    return jsonError("Comment must be between 2 and 2000 characters");
  }

  if (parentId !== null) {
    const parent = await getCommentForPost(db, post.id, parentId);
    if (!parent || parent.status !== "approved" || parent.parent_id !== null) {
      return jsonError("Invalid parent comment", 400);
    }
  }

  const hashSecret = (locals as CloudflareLocals).runtime.env.COMMENT_HASH_SECRET;
  if (!hashSecret) {
    return jsonError("Comment service is not configured", 503);
  }
  const ipHash = await sha256(`${hashSecret}:${getIpAddress(request)}`);
  const userAgent = request.headers.get("User-Agent") || "";
  const userAgentHash = userAgent
    ? await sha256(`${hashSecret}:${userAgent}`)
    : null;

  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const recentCount = await countRecentCommentsByIp(db, post.id, ipHash, since);
  if (recentCount > 0) {
    return jsonError("Please wait before posting another comment", 429);
  }

  const now = new Date().toISOString();
  const comment = await createComment(db, {
    postId: post.id,
    parentId,
    authorName,
    authorEmailHash: authorEmail
      ? await sha256(`${hashSecret}:${authorEmail}`)
      : null,
    content,
    status: "pending",
    ipHash,
    userAgentHash,
    createdAt: now,
    updatedAt: now,
  });

  if (!comment) return jsonError("Unable to create comment", 500);

  return Response.json(
    {
      comment: {
        id: comment.id,
        parentId: comment.parent_id,
        authorName: comment.author_name,
        content: comment.content,
        status: comment.status,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
      },
    },
    { status: 201, headers: { "Cache-Control": "no-store" } }
  );
};
