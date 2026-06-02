import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePosts, useDeletePost } from "./hooks";
import { vars, card, btnPrimary, btnSecondary, btnDanger, badge, spinnerStyle } from "./styles";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });

const responsiveCss = `
@media (max-width: 640px) {
  .pl-post { grid-template-columns: 1fr !important; }
  .pl-post-actions { justify-content: flex-end !important; }
  .pl-stat-num { font-size: 1.25rem !important; }
  .pl-stat { padding: 0.75rem !important; }
  .pl-title { white-space: normal !important; }
}
`;

function Loading() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
      <div style={{
        width: "1.5rem", height: "1.5rem", border: "2px solid var(--border)",
        borderTopColor: "var(--accent)", borderRadius: "50%",
        animation: "admin-spin 0.6s linear infinite",
      }} />
      <style>{spinnerStyle}</style>
    </div>
  );
}

function PostListInner() {
  const { data: posts, isLoading } = usePosts();
  const deletePost = useDeletePost();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (isLoading) return <Loading />;

  const all = posts || [];
  const published = all.filter(p => !p.draft).length;
  const drafts = all.filter(p => p.draft).length;

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(slug);
    try {
      await deletePost.mutateAsync(slug);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <style>{responsiveCss}</style>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total", value: all.length, color: "var(--foreground)" },
          { label: "Published", value: published, color: "#16a34a" },
          { label: "Drafts", value: drafts, color: "#d97706" },
        ].map(stat => (
          <div key={stat.label} className="pl-stat" style={{
            padding: "1rem 1.25rem",
            background: "var(--muted)",
            borderRadius: "0.5rem",
            border: "1px solid var(--border)",
          }}>
            <div style={{
              fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.1em",
              color: "var(--muted-foreground)", marginBottom: "0.25rem", fontWeight: 600,
              fontFamily: vars.font,
            }}>
              {stat.label}
            </div>
            <div className="pl-stat-num" style={{
              fontSize: "1.5rem", fontWeight: 700, color: stat.color, lineHeight: 1,
              fontFamily: vars.font,
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{
          fontSize: "0.9375rem", fontWeight: 600, color: "var(--foreground)",
          margin: 0, fontFamily: vars.font,
        }}>
          All Posts
        </h2>
        <a href="/admin/posts/new" style={btnPrimary}>
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>+</span> New Post
        </a>
      </div>

      {/* Post list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        {all.map(post => (
          <div
            key={post.id}
            className="pl-post"
            onMouseEnter={() => setHoveredId(post.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              ...card,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: "1rem",
              padding: "0.875rem 1.25rem",
              borderColor: hoveredId === post.id ? "var(--accent)" : "var(--border)",
              boxShadow: hoveredId === post.id ? "0 1px 4px rgba(0,0,0,0.04)" : "none",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                marginBottom: "0.25rem",
                flexWrap: "wrap",
              }}>
                <a
                  href={`/admin/posts/edit/${post.slug}`}
                  className="pl-title"
                  style={{
                    color: "var(--foreground)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontFamily: vars.font,
                  }}
                >
                  {post.title}
                </a>
                <span style={badge(post.draft ? "draft" : "published")}>
                  {post.draft ? "Draft" : "Published"}
                </span>
                {post.featured && (
                  <span style={{ fontSize: "0.625rem", color: "var(--accent)" }} title="Featured">&#9733;</span>
                )}
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                fontSize: "0.75rem", color: "var(--muted-foreground)", fontFamily: vars.font,
                flexWrap: "wrap",
              }}>
                <time>{new Date(post.pubDatetime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
                {post.tags.length > 0 && (
                  <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                    {post.tags.slice(0, 3).map(t => (
                      <span key={t.id} style={{
                        padding: "0.0625rem 0.375rem",
                        background: "var(--muted)",
                        borderRadius: "0.25rem",
                        fontSize: "0.625rem",
                        whiteSpace: "nowrap",
                      }}>
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pl-post-actions" style={{
              display: "flex",
              gap: "0.25rem",
              alignItems: "center",
            }}>
              <a
                href={`/admin/posts/edit/${post.slug}`}
                style={{
                  ...btnSecondary,
                  padding: "0.375rem 0.75rem",
                  fontSize: "0.75rem",
                  borderRadius: "0.375rem",
                }}
              >
                Edit
              </a>
              <button
                onClick={() => handleDelete(post.slug, post.title)}
                disabled={deleting === post.slug}
                style={{
                  ...btnDanger,
                  opacity: deleting === post.slug ? 0.4 : 1,
                  cursor: deleting === post.slug ? "not-allowed" : "pointer",
                }}
              >
                {deleting === post.slug ? "..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {all.length === 0 && (
        <div style={{
          textAlign: "center", padding: "4rem 0",
          color: "var(--muted-foreground)", fontSize: "0.875rem",
          fontFamily: vars.font,
        }}>
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
