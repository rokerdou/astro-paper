import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTags } from "./hooks";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });

function TagManagerInner() {
  const { data: tags, isLoading } = useTags();
  const [newTag, setNewTag] = useState("");

  if (isLoading) return <div style={{ padding: "2rem" }}>Loading...</div>;

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
      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>Tags</h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <input
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          placeholder="New tag name"
          onKeyDown={e => e.key === "Enter" && handleCreate()}
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            border: "1px solid var(--border)",
            borderRadius: "0.375rem",
            background: "var(--background)",
            color: "var(--foreground)",
          }}
        />
        <button
          onClick={handleCreate}
          style={{
            padding: "0.5rem 1rem",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {(tags || []).map(tag => (
          <span
            key={tag.id}
            style={{
              padding: "0.25rem 0.75rem",
              border: "1px solid var(--border)",
              borderRadius: "1rem",
              fontSize: "0.875rem",
            }}
          >
            {tag.name}
          </span>
        ))}
      </div>
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
