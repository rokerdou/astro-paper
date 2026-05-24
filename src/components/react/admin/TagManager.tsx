import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTags } from "./hooks";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });

const input: React.CSSProperties = {
  padding: "0.625rem 0.875rem",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  background: "var(--background)",
  color: "var(--foreground)",
  fontSize: "0.875rem",
  outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box",
};

function TagManagerInner() {
  const { data: tags, isLoading } = useTags();
  const [newTag, setNewTag] = useState("");

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

  const handleCreate = async () => {
    if (!newTag.trim()) return;
    await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTag.trim() }),
    });
    setNewTag("");
    window.location.reload();
  };

  return (
    <div>
      {/* Create tag */}
      <div style={{
        display: "flex",
        gap: "0.75rem",
        marginBottom: "2rem",
        padding: "1.25rem",
        background: "var(--background)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
      }}>
        <input
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          placeholder="New tag name..."
          onKeyDown={e => e.key === "Enter" && handleCreate()}
          style={{ ...input, flex: 1 }}
        />
        <button
          onClick={handleCreate}
          style={{
            padding: "0.625rem 1.25rem",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.875rem",
            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
          }}
        >
          Add Tag
        </button>
      </div>

      {/* Tag grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(10rem, 1fr))",
        gap: "0.625rem",
      }}>
        {(tags || []).map(tag => (
          <div
            key={tag.id}
            style={{
              padding: "0.75rem 1rem",
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{
              width: "0.5rem", height: "0.5rem",
              borderRadius: "50%",
              background: "var(--accent)",
              flexShrink: 0,
            }} />
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground)" }}>
              {tag.name}
            </span>
          </div>
        ))}
      </div>

      {(!tags || tags.length === 0) && (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
          No tags yet. Create your first tag above.
        </div>
      )}
    </div>
  );
}

export default function TagManager() {
  return (
    <QueryClientProvider client={queryClient}>
      <TagManagerInner />
    </QueryClientProvider>
  );
}
