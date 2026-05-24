import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePosts, useDeletePost } from "./hooks";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });

function PostListInner() {

export default function PostList() {
  const { data: posts, isLoading } = usePosts();
  const deletePost = useDeletePost();
  const [deleting, setDeleting] = useState<string | null>(null);

  if (isLoading) return <div style={{ padding: "2rem" }}>Loading...</div>;

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete "${slug}"?`)) return;
    setDeleting(slug);
    await deletePost.mutateAsync(slug);
    setDeleting(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>All Posts</h2>
        <a
          href="/admin/posts/new"
          style={{
            padding: "0.5rem 1rem",
            background: "var(--accent)",
            color: "#fff",
            borderRadius: "0.375rem",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          New Post
        </a>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "left" }}>
            <th style={{ padding: "0.5rem" }}>Title</th>
            <th style={{ padding: "0.5rem" }}>Status</th>
            <th style={{ padding: "0.5rem" }}>Published</th>
            <th style={{ padding: "0.5rem" }}>Tags</th>
            <th style={{ padding: "0.5rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(posts || []).map(post => (
            <tr key={post.id} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "0.5rem" }}>
                <a href={`/admin/posts/edit/${post.slug}`} style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
                  {post.title}
                </a>
              </td>
              <td style={{ padding: "0.5rem" }}>
                <span style={{
                  padding: "0.125rem 0.5rem",
                  borderRadius: "1rem",
                  fontSize: "0.75rem",
                  background: post.draft ? "var(--border)" : "#22c55e20",
                  color: post.draft ? "var(--foreground)" : "#16a34a",
                }}>
                  {post.draft ? "Draft" : "Published"}
                </span>
              </td>
              <td style={{ padding: "0.5rem", fontSize: "0.875rem" }}>
                {new Date(post.pubDatetime).toLocaleDateString()}
              </td>
              <td style={{ padding: "0.5rem", fontSize: "0.875rem" }}>
                {post.tags.map(t => t.name).join(", ")}
              </td>
              <td style={{ padding: "0.5rem" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <a href={`/admin/posts/edit/${post.slug}`} style={{ color: "var(--accent)", fontSize: "0.875rem" }}>Edit</a>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    disabled={deleting === post.slug}
                    style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem" }}
                  >
                    {deleting === post.slug ? "..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
