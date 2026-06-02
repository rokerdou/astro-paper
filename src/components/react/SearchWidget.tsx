import { useState, useCallback, useRef, useEffect } from "react";

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
}

export default function SearchWidget() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
      doSearch(q);
    }
  }, []);

  const doSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(term.trim())}`
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = (await response.json()) as { results: SearchResult[] };
      setResults(data.results);
    } catch {
      setResults([]);
      setError("Search is temporarily unavailable.");
    } finally {
      setLoading(false);
    }

    const params = new URLSearchParams(window.location.search);
    params.set("q", term);
    history.replaceState(history.state, "", "?" + params.toString());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim() === "") {
      setResults([]);
      history.replaceState(history.state, "", window.location.pathname);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      doSearch(query);
    }
  };

  return (
    <div className="search-widget">
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search articles..."
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            border: "1px solid var(--border)",
            borderRadius: "0.375rem",
            background: "var(--background)",
            color: "var(--foreground)",
            fontSize: "1rem",
            outline: "none",
          }}
        />
        <button
          onClick={() => doSearch(query)}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid var(--border)",
            borderRadius: "0.375rem",
            background: "var(--accent)",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {loading ? "..." : "Search"}
        </button>
      </div>

      {error && (
        <p style={{ color: "var(--accent)", marginBottom: "1rem" }}>{error}</p>
      )}

      <div>
        {results.map(r => (
          <article
            key={r.url}
            style={{
              borderBottom: "1px solid var(--border)",
              padding: "1rem 0",
            }}
          >
            <a
              href={r.url}
              style={{
                color: "var(--accent)",
                fontWeight: 600,
                fontSize: "1.125rem",
                textDecoration: "none",
              }}
            >
              {r.title}
            </a>
            <p
              style={{
                marginTop: "0.25rem",
                color: "var(--foreground)",
                opacity: 0.75,
              }}
            >
              {r.excerpt}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
