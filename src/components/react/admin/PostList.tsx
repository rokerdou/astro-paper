import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePosts, useDeletePost } from "./hooks";
import {
  vars,
  card,
  btnSecondary,
  btnDanger,
  badge,
  spinnerStyle,
} from "./styles";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
});

const responsiveCss = `
@media (max-width: 720px) {
  .pl-stats { grid-template-columns: 1fr !important; }
  .pl-post { grid-template-columns: 1fr !important; }
  .pl-post-actions { justify-content: flex-end !important; }
  .pl-stat-num { font-size: 1.25rem !important; }
  .pl-stat { padding: 0.75rem !important; }
  .pl-title { white-space: normal !important; }
  .pl-panel-head { flex-direction: column !important; align-items: stretch !important; }
}
`;

function Loading() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}
    >
      <div
        style={{
          width: "1.5rem",
          height: "1.5rem",
          border: "2px solid var(--border)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "admin-spin 0.6s linear infinite",
        }}
      />
      <style>{spinnerStyle}</style>
    </div>
  );
}

function PostListInner() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePosts(page, 50);
  const deletePost = useDeletePost();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (isLoading) return <Loading />;

  const all = data?.posts || [];
  const published = data?.stats.published ?? 0;
  const drafts = data?.stats.drafts ?? 0;

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

      <div
        className="pl-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        {[
          {
            label: "Total",
            value: data?.stats.total ?? 0,
            color: "var(--foreground)",
          },
          { label: "Published", value: published, color: "#16a34a" },
          { label: "Drafts", value: drafts, color: "#d97706" },
        ].map(stat => (
          <div
            key={stat.label}
            className="pl-stat"
            style={{
              ...card,
              padding: "1rem 1.125rem",
              background: "var(--background)",
            }}
          >
            <div
              style={{
                fontSize: "0.6875rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted-foreground)",
                marginBottom: "0.375rem",
                fontWeight: 700,
                fontFamily: vars.font,
              }}
            >
              {stat.label}
            </div>
            <div
              className="pl-stat-num"
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: stat.color,
                lineHeight: 1,
                fontFamily: vars.font,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <section style={card}>
        <div
          className="pl-panel-head"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "var(--foreground)",
                margin: 0,
                fontFamily: vars.font,
              }}
            >
              Content Queue
            </h2>
            <p
              style={{
                margin: "0.25rem 0 0",
                color: "var(--muted-foreground)",
                fontSize: "0.8125rem",
                fontFamily: vars.font,
              }}
            >
              Showing {all.length} posts from page{" "}
              {data?.pagination.page ?? page}.
            </p>
          </div>
          <span
            style={{
              alignSelf: "center",
              color: "var(--muted-foreground)",
              fontSize: "0.75rem",
              fontFamily: vars.font,
              fontWeight: 700,
            }}
          >
            50 per page
          </span>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {all.map(post => (
            <div
              key={post.id}
              className="pl-post"
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                alignItems: "center",
                gap: "1rem",
                padding: "0.875rem 1rem",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                background:
                  hoveredId === post.id
                    ? "color-mix(in srgb, var(--accent) 6%, var(--background))"
                    : "var(--background)",
                borderColor:
                  hoveredId === post.id ? "var(--accent)" : "var(--border)",
                transition: "border-color 0.15s, background 0.15s",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.375rem",
                    flexWrap: "wrap",
                  }}
                >
                  <a
                    href={`/admin/posts/edit/${post.slug}`}
                    className="pl-title"
                    style={{
                      color: "var(--foreground)",
                      textDecoration: "none",
                      fontWeight: 750,
                      fontSize: "0.9375rem",
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
                    <span style={badge("featured")}>Featured</span>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.75rem",
                    color: "var(--muted-foreground)",
                    fontFamily: vars.font,
                    flexWrap: "wrap",
                  }}
                >
                  <time>
                    {new Date(post.pubDatetime).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  <span>{post.slug}</span>
                  {post.tags.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.25rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {post.tags.slice(0, 3).map(t => (
                        <span
                          key={t.id}
                          style={{
                            padding: "0.125rem 0.375rem",
                            background: "var(--muted)",
                            borderRadius: "0.375rem",
                            fontSize: "0.6875rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div
                className="pl-post-actions"
                style={{
                  display: "flex",
                  gap: "0.25rem",
                  alignItems: "center",
                }}
              >
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
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "var(--muted-foreground)",
              fontSize: "0.875rem",
              fontFamily: vars.font,
            }}
          >
            No posts yet. Create your first post.
          </div>
        )}

        {(data?.pagination.lastPage ?? 1) > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "1.5rem",
              fontFamily: vars.font,
            }}
          >
            <button
              type="button"
              onClick={() => setPage(current => Math.max(1, current - 1))}
              disabled={page <= 1}
              style={{ ...btnSecondary, opacity: page <= 1 ? 0.5 : 1 }}
            >
              Prev
            </button>
            <span
              style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}
            >
              {data?.pagination.page ?? page} / {data?.pagination.lastPage ?? 1}
            </span>
            <button
              type="button"
              onClick={() =>
                setPage(current =>
                  Math.min(data?.pagination.lastPage ?? current, current + 1)
                )
              }
              disabled={page >= (data?.pagination.lastPage ?? 1)}
              style={{
                ...btnSecondary,
                opacity: page >= (data?.pagination.lastPage ?? 1) ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>
        )}
      </section>
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
