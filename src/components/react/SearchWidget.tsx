import { useState, useCallback, useRef, useEffect } from "react";

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  sub_results?: { url: string; title: string; excerpt: string }[];
}

interface PagefindInstance {
  search: (query: string) => Promise<{ results: { data: () => Promise<{ url: string; meta: { title: string }; excerpt: string; sub_results?: { url: string; title: string; excerpt: string }[] }> }[] }>;
}

export default function SearchWidget() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const pagefindRef = useRef<PagefindInstance | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
      doSearch(q);
    }
  }, []);

  const loadPagefind = useCallback(async (): Promise<PagefindInstance | null> => {
    if (pagefindRef.current) return pagefindRef.current;
    try {
      // @ts-expect-error — Pagefind is loaded at build time, dynamic path to avoid Rollup resolution
      const pagefind = await import(/* @vite-ignore */ "/pagefind/pagefind.js");
      await pagefind.init();
      pagefindRef.current = pagefind;
      return pagefind;
    } catch {
      console.warn("Pagefind not available. Run `pnpm build` first.");
      return null;
    }
  }, []);

  const doSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const pf = await loadPagefind();
    if (!pf) {
      setLoading(false);
      return;
    }
    const search = await pf.search(term);
    const data = await Promise.all(search.results.map(r => r.data()));
    setResults(
      data.map(d => ({
        url: d.url,
        title: d.meta.title,
        excerpt: d.excerpt,
        sub_results: d.sub_results?.map(sr => ({
          url: sr.url,
          title: sr.title,
          excerpt: sr.excerpt,
        })),
      })),
    );
    setLoading(false);

    const params = new URLSearchParams(window.location.search);
    params.set("q", term);
    history.replaceState(history.state, "", "?" + params.toString());
  }, [loadPagefind]);

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

  const isDev = import.meta.env.DEV;

  return (
    <div className="search-widget">
      {isDev && (
        <div
          style={{
            background: "var(--border)",
            borderRadius: "0.375rem",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <p>
            <strong>DEV mode Warning!</strong> You need to build the project at
            least once to see search results during development.
          </p>
          <code
            style={{
              display: "block",
              background: "#000",
              color: "#fff",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.25rem",
            }}
          >
            pnpm run build
          </code>
        </div>
      )}

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
              dangerouslySetInnerHTML={{ __html: r.excerpt }}
            />
            {r.sub_results && r.sub_results.length > 0 && (
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}>
                {r.sub_results.map(sr => (
                  <li key={sr.url}>
                    <a
                      href={sr.url}
                      style={{
                        color: "var(--accent)",
                        fontSize: "0.875rem",
                        textDecoration: "none",
                      }}
                    >
                      {sr.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
