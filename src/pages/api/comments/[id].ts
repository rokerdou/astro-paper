import type { APIRoute } from "astro";
import { deleteComment, updateCommentStatus, type CommentStatus } from "@/db/d1";
import { getD1 } from "@/utils/cloudflare";

export const prerender = false;

function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

function parseStatus(value: unknown): CommentStatus | null {
  return value === "pending" || value === "approved" || value === "rejected"
    ? value
    : null;
}

export const PATCH: APIRoute = async ({ params, request, locals }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return jsonError("Invalid comment id");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const status = parseStatus(body.status);
  if (!status) return jsonError("Invalid comment status");

  const comment = await updateCommentStatus(getD1(locals), id, status);
  if (!comment) return jsonError("Comment not found", 404);

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
    { headers: { "Cache-Control": "no-store" } }
  );
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return jsonError("Invalid comment id");

  await deleteComment(getD1(locals), id);
  return Response.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } }
  );
};
