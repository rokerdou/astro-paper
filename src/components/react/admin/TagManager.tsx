import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTags } from "./hooks";
import { vars, input, card, btnPrimary, spinnerStyle } from "./styles";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
});

const responsiveCss = `
@media (max-width: 640px) {
  .tm-form { flex-direction: column !important; align-items: stretch !important; }
  .tm-grid { grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr)) !important; }
  .tm-summary { grid-template-columns: 1fr !important; }
}
`;

function TagManagerInner() {
  const { data: tags, isLoading } = useTags();
  const [newTag, setNewTag] = useState("");
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  if (isLoading) {
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

  const handleCreate = async () => {
    const name = newTag.trim();
    if (!name) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error || "Failed to create tag");
        return;
      }
      setNewTag("");
      window.location.reload();
    } catch {
      setError("Network error");
    } finally {
      setCreating(false);
    }
  };

  const all = tags || [];
  const filtered = all.filter(tag =>
    tag.name.toLowerCase().includes(search.trim().toLowerCase())
  );
  const usedCount = all.filter(tag => (tag.postCount ?? 0) > 0).length;

  return (
    <div>
      <style>{responsiveCss}</style>

      <div
        className="tm-summary"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        {[
          ["Tags", all.length],
          ["In use", usedCount],
          ["Nested", all.filter(tag => tag.name.includes("/")).length],
        ].map(([name, value]) => (
          <div
            key={String(name)}
            style={{
              ...card,
              padding: "0.875rem 1rem",
            }}
          >
            <div
              style={{
                color: "var(--muted-foreground)",
                fontFamily: vars.font,
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {name}
            </div>
            <div
              style={{
                marginTop: "0.25rem",
                color: "var(--foreground)",
                fontFamily: vars.font,
                fontSize: "1.25rem",
                fontWeight: 700,
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Create */}
      <div
        className="tm-form"
        style={{
          ...card,
          display: "flex",
          gap: "0.75rem",
          marginBottom: "2rem",
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "0.6875rem",
              fontWeight: 600,
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
              color: "var(--muted-foreground)",
              marginBottom: "0.5rem",
              fontFamily: vars.font,
            }}
          >
            New Tag
          </label>
          <input
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            placeholder="Tag name..."
            onKeyDown={e => e.key === "Enter" && handleCreate()}
            style={input}
          />
        </div>
        <button
          onClick={handleCreate}
          disabled={creating || !newTag.trim()}
          style={{
            ...btnPrimary,
            opacity: creating || !newTag.trim() ? 0.5 : 1,
            cursor: creating || !newTag.trim() ? "not-allowed" : "pointer",
            flexShrink: 0,
          }}
        >
          {creating ? "Adding..." : "Add Tag"}
        </button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tags..."
          style={input}
        />
      </div>

      {error && (
        <div
          style={{
            padding: "0.625rem 1rem",
            marginBottom: "1rem",
            borderRadius: "0.5rem",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#ef4444",
            fontSize: "0.8125rem",
            fontFamily: vars.font,
          }}
        >
          {error}
        </div>
      )}

      {/* Tag grid */}
      <div
        className="tm-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))",
          gap: "0.5rem",
        }}
      >
        {filtered.map(tag => (
          <div
            key={tag.id}
            style={{
              padding: "0.625rem 0.875rem",
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              transition: "border-color 0.15s",
              minWidth: 0,
            }}
          >
            <span
              style={{
                width: "0.375rem",
                height: "0.375rem",
                borderRadius: "50%",
                background: "var(--accent)",
                flexShrink: 0,
                marginTop: "0.45rem",
              }}
            />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  fontFamily: vars.font,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={tag.name}
              >
                {tag.name}
              </div>
              <div
                style={{
                  marginTop: "0.125rem",
                  fontSize: "0.6875rem",
                  color: "var(--muted-foreground)",
                  fontFamily: vars.font,
                  whiteSpace: "nowrap",
                }}
              >
                {tag.postCount ?? 0} posts
              </div>
            </div>
          </div>
        ))}
      </div>

      {all.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 0",
            color: "var(--muted-foreground)",
            fontSize: "0.875rem",
            fontFamily: vars.font,
          }}
        >
          No tags yet. Create your first tag above.
        </div>
      )}
      {all.length > 0 && filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 0",
            color: "var(--muted-foreground)",
            fontSize: "0.875rem",
            fontFamily: vars.font,
          }}
        >
          No tags match your search.
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
