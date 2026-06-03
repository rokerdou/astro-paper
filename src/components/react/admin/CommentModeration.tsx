import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { badge, btnDanger, btnSecondary, card, spinnerStyle, vars } from "./styles";

type CommentStatus = "pending" | "approved" | "rejected";

interface CommentItem {
  id: number;
  postSlug?: string;
  postTitle?: string;
  parentId: number | null;
  authorName: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
}

interface CommentsResponse {
  comments: CommentItem[];
  pagination: { page: number; pageSize: number };
}

const queryClientKey = "admin-comments";
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

function Loading() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
      <div style={{
        width: "1.5rem",
        height: "1.5rem",
        border: "2px solid var(--border)",
        borderTopColor: "var(--accent)",
        borderRadius: "50%",
        animation: "admin-spin 0.6s linear infinite",
      }} />
      <style>{spinnerStyle}</style>
    </div>
  );
}

function statusBadge(status: CommentStatus) {
  if (status === "approved") return badge("published");
  if (status === "rejected") return badge("draft");
  return {
    ...badge("draft"),
    color: "#2563eb",
    background: "rgba(37, 99, 235, 0.12)",
  };
}

function CommentModerationInner() {
  const [status, setStatus] = useState<CommentStatus>("pending");
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<CommentsResponse>({
    queryKey: [queryClientKey, status],
    queryFn: async () => {
      const response = await fetch(`/api/comments?status=${status}&pageSize=50`);
      if (!response.ok) throw new Error("Unable to load comments");
      return response.json();
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, nextStatus }: { id: number; nextStatus: CommentStatus }) => {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) throw new Error("Unable to update comment");
      return response.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryClientKey] }),
  });

  const deleteComment = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete comment");
      return response.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryClientKey] }),
  });

  const comments = data?.comments ?? [];

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "1rem",
      }}>
        <h2 style={{
          margin: 0,
          color: "var(--foreground)",
          fontFamily: vars.font,
          fontSize: "0.9375rem",
          fontWeight: 600,
        }}>
          Comment Moderation
        </h2>
        <select
          value={status}
          onChange={event => setStatus(event.target.value as CommentStatus)}
          style={{
            border: "1px solid var(--border)",
            borderRadius: "0.375rem",
            background: "var(--background)",
            color: "var(--foreground)",
            fontFamily: vars.font,
            fontSize: "0.8125rem",
            padding: "0.5rem 0.75rem",
          }}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {isLoading ? (
        <Loading />
      ) : comments.length === 0 ? (
        <div style={{
          ...card,
          padding: "3rem 1rem",
          textAlign: "center",
          color: "var(--muted-foreground)",
          fontFamily: vars.font,
          fontSize: "0.875rem",
        }}>
          No comments in this queue.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {comments.map(comment => (
            <article key={comment.id} style={{ ...card, padding: "1rem 1.25rem" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                marginBottom: "0.5rem",
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    fontFamily: vars.font,
                  }}>
                    <strong style={{ fontSize: "0.875rem" }}>{comment.authorName}</strong>
                    <span style={statusBadge(comment.status)}>{comment.status}</span>
                    {comment.parentId && (
                      <span style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>
                        Reply
                      </span>
                    )}
                  </div>
                  <a
                    href={`/posts/${comment.postSlug}/`}
                    style={{
                      color: "var(--accent)",
                      display: "inline-block",
                      fontFamily: vars.font,
                      fontSize: "0.75rem",
                      marginTop: "0.25rem",
                      textDecoration: "none",
                    }}
                  >
                    {comment.postTitle || comment.postSlug}
                  </a>
                </div>
                <time style={{
                  color: "var(--muted-foreground)",
                  flexShrink: 0,
                  fontFamily: vars.font,
                  fontSize: "0.75rem",
                }}>
                  {new Date(comment.createdAt).toLocaleString()}
                </time>
              </div>
              <p style={{
                color: "var(--foreground)",
                fontFamily: vars.font,
                fontSize: "0.875rem",
                lineHeight: 1.6,
                margin: "0 0 1rem",
                whiteSpace: "pre-wrap",
              }}>
                {comment.content}
              </p>
              <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                {comment.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => updateStatus.mutate({ id: comment.id, nextStatus: "approved" })}
                    style={btnSecondary}
                  >
                    Approve
                  </button>
                )}
                {comment.status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => updateStatus.mutate({ id: comment.id, nextStatus: "rejected" })}
                    style={btnSecondary}
                  >
                    Reject
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this comment?")) deleteComment.mutate(comment.id);
                  }}
                  style={btnDanger}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentModeration() {
  return (
    <QueryClientProvider client={queryClient}>
      <CommentModerationInner />
    </QueryClientProvider>
  );
}
