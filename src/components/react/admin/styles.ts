export const vars = {
  font: `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`,
  mono: `ui-monospace, "SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace`,
};

export const input: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  background: "var(--background)",
  color: "var(--foreground)",
  fontSize: "0.875rem",
  lineHeight: 1.5,
  transition: "border-color 0.15s, box-shadow 0.15s",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: vars.font,
};

export const label: React.CSSProperties = {
  display: "block",
  fontSize: "0.6875rem",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  color: "var(--muted-foreground)",
  marginBottom: "0.5rem",
};

export const card: React.CSSProperties = {
  background: "var(--background)",
  border: "1px solid var(--border)",
  borderRadius: "0.75rem",
  padding: "1.25rem",
  transition: "box-shadow 0.2s, border-color 0.2s",
};

export const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.375rem",
  padding: "0.5rem 1.25rem",
  border: "none",
  borderRadius: "0.5rem",
  background: "var(--accent)",
  color: "#fff",
  fontSize: "0.8125rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "opacity 0.15s, transform 0.1s",
  fontFamily: vars.font,
  lineHeight: 1.4,
};

export const btnSecondary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.375rem",
  padding: "0.5rem 1rem",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  background: "transparent",
  color: "var(--foreground)",
  fontSize: "0.8125rem",
  fontWeight: 500,
  cursor: "pointer",
  textDecoration: "none",
  transition: "border-color 0.15s, background 0.15s",
  fontFamily: vars.font,
  lineHeight: 1.4,
};

export const btnDanger: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.375rem 0.75rem",
  border: "1px solid transparent",
  borderRadius: "0.375rem",
  color: "#ef4444",
  background: "transparent",
  fontSize: "0.8125rem",
  fontWeight: 500,
  cursor: "pointer",
  transition: "background 0.15s, color 0.15s",
  fontFamily: vars.font,
};

export const badge = (type: "draft" | "published" | "featured"): React.CSSProperties => {
  const map: Record<string, React.CSSProperties> = {
    draft: {
      padding: "0.125rem 0.5rem",
      borderRadius: "9999px",
      fontSize: "0.625rem",
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase" as const,
      background: "rgba(217,119,6,0.1)",
      color: "#d97706",
      whiteSpace: "nowrap" as const,
      flexShrink: 0,
    },
    published: {
      padding: "0.125rem 0.5rem",
      borderRadius: "9999px",
      fontSize: "0.625rem",
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase" as const,
      background: "rgba(22,163,74,0.1)",
      color: "#16a34a",
      whiteSpace: "nowrap" as const,
      flexShrink: 0,
    },
    featured: {
      fontSize: "0.75rem",
      color: "var(--accent)",
    },
  };
  return map[type];
};

export const spinnerStyle = `
@keyframes admin-spin {
  to { transform: rotate(360deg) }
}
`;

export const loadingDots: React.CSSProperties = {
  display: "flex",
  gap: "0.375rem",
  alignItems: "center",
  justifyContent: "center",
};
