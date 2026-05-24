import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePosts, useDeletePost } from "./hooks";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });

const s = {
  card: {
    background: "var(--background)",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    overflow: "hidden" as const,
  },
  cardHover: {
    transition: "box-shadow 0.2s, border-color 0.2s",
  },
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

function PostListInner() {
  const { data: posts, isLoading } = usePosts();
  const deletePost = useDeletePost();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
        <div style={{
          width: "2rem", height: "2rem", border: "2px solid var(--border)",
          borderTopColor: "var(--accent)", borderRadius: "50%",
          animation: "admin-spin 0.6s linear infinite",
        }} />
        <style>{`@keyframes admin-spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete "${slug}"?`)) return;
    setDeleting(slug);
    await deletePost.mutateAsync(slug);
    setDeleting(null);
  };

  const published = (posts || []).filter(p => !p.draft).length;
  const drafts = (posts || []).filter(p => p.draft).length;

  return (
    <div>
      {/* Stats bar */}
      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem" }}>
        <div style={{
          padding: "1rem 1.5rem",
          background: "var(--muted)",
          borderRadius: "0.5rem",
          flex: 1,
          border: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>Total</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)", lineHeight: 1 }}>{(posts || []).length}</div>
        </div>
        <div style={{
          padding: "1rem 1.5rem",
          background: "var(--muted)",
          borderRadius: "0.5rem",
          flex: 1,
          border: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>Published</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#16a34a", lineHeight: 1 }}>{published}</div>
        </div>
        <div style={{
          padding: "1rem 1.5rem",
          background: "var(--muted)",
          borderRadius: "0.5rem",
          flex: 1,
          border: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>Drafts</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#d97706", lineHeight: 1 }}>{drafts}</div>
        </div>
      </div>

      {/* Header row */}
      <div style={{ ...s.flexBetween, marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--foreground)", margin: 0 }}>All Posts</h2>
        <a
          href="/admin/posts/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.5rem 1.125rem",
            background: "var(--accent)",
            color: "#fff",
            borderRadius: "0.5rem",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.8125rem",
            transition: "opacity 0.15s",
            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
          }}
        >
          <span style={{ fontSize: "1.125rem", lineHeight: 1 }}>+</span> New Post
        </a>
      </div>

      {/* Post cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {(posts || []).map(post => (
          <div
            key={post.id}
            onMouseEnter={() => setHoveredId(post.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              ...s.card,
              ...s.cardHover,
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem 1.25rem",
              boxShadow: hoveredId === post.id ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              borderColor: hoveredId === post.id ? "var(--accent)" : "var(--border)",
            }}
          >
            {/* Left: title + meta */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
                <a
                  href={`/admin/posts/edit/${post.slug}`}
                  style={{
                    color: "var(--foreground)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {post.title}
                </a>
                <span style={{
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  background: post.draft ? "rgba(217,119,6,0.1)" : "rgba(22,163,74,0.1)",
                  color: post.draft ? "#d97706" : "#16a34a",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}>
                  {post.draft ? "Draft" : "Published"}
                </span>
                {post.featured && (
                  <span style={{ fontSize: "0.75rem", color: "var(--accent)" }} title="Featured">&#9733;</span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
                <time>{new Date(post.pubDatetime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
                {post.tags.length > 0 && (
                  <div style={{ display: "flex", gap: "0.25rem", overflow: "hidden" }}>
                    {post.tags.slice(0, 3).map(t => (
                      <span key={t.id} style={{
                        padding: "0.0625rem 0.375rem",
                        background: "var(--muted)",
                        borderRadius: "0.25rem",
                        fontSize: "0.6875rem",
                        whiteSpace: "nowrap",
                      }}>
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: actions */}
            <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
              <a
                href={`/admin/posts/edit/${post.slug}`}
                style={{
                  padding: "0.375rem 0.75rem",
                  border: "1px solid var(--border)",
                  borderRadius: "0.375rem",
                  color: "var(--foreground)",
                  textDecoration: "none",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  transition: "border-color 0.15s, background 0.15s",
                  background: "transparent",
                }}
              >
                Edit
              </a>
              <button
                onClick={() => handleDelete(post.slug)}
                disabled={deleting === post.slug}
                style={{
                  padding: "0.375rem 0.75rem",
                  border: "1px solid transparent",
                  borderRadius: "0.375rem",
                  color: deleting === post.slug ? "var(--muted-foreground)" : "#ef4444",
                  background: "transparent",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  cursor: deleting === post.slug ? "not-allowed" : "pointer",
                  opacity: deleting === post.slug ? 0.5 : 1,
                  transition: "background 0.15s, opacity 0.15s",
                }}
              >
                {deleting === post.slug ? "..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {(!posts || posts.length === 0) && (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--muted-foreground)" }}>
          No posts yet. Create your first post.
        </div>
      )}
    </div>
  );
}

export default function PostList() {
  return (
    <QueryClientProvider client={queryClient}>
      <PostListInner />
    </QueryClientProvider>
  );
}
