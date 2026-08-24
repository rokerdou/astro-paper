export const vars = {
  font: `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`,
  mono: `ui-monospace, "SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace`,
};

export const input: React.CSSProperties = {
  width: "100%",
  minHeight: "2.75rem",
  padding: "0.625rem 0.875rem",
  border: "1px solid #e6dfd5",
  borderRadius: "0.625rem",
  background: "#fffdfa",
  color: "#181612",
  fontSize: "0.875rem",
  lineHeight: 1.5,
  transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
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
  color: "#756e65",
  marginBottom: "0.5rem",
};

export const card: React.CSSProperties = {
  background: "#fffdfa",
  border: "1px solid #e6dfd5",
  borderRadius: "0.875rem",
  padding: "1.25rem",
  boxShadow: "0 1px 0 rgba(24, 22, 18, 0.03)",
  transition: "box-shadow 0.2s, border-color 0.2s, background 0.2s",
};

export const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.375rem",
  minHeight: "2.75rem",
  padding: "0.5rem 1.25rem",
  border: "none",
  borderRadius: "0.625rem",
  background: "#181612",
  color: "#fffdfa",
  fontSize: "0.8125rem",
  fontWeight: 750,
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
  minHeight: "2.75rem",
  padding: "0.5rem 1rem",
  border: "1px solid #e6dfd5",
  borderRadius: "0.625rem",
  background: "#fffdfa",
  color: "#181612",
  fontSize: "0.8125rem",
  fontWeight: 650,
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
  minHeight: "2.5rem",
  padding: "0.375rem 0.75rem",
  border: "1px solid transparent",
  borderRadius: "0.5rem",
  color: "#b42318",
  background: "transparent",
  fontSize: "0.8125rem",
  fontWeight: 650,
  cursor: "pointer",
  transition: "background 0.15s, color 0.15s",
  fontFamily: vars.font,
};

export const badge = (
  type: "draft" | "published" | "featured"
): React.CSSProperties => {
  const map: Record<string, React.CSSProperties> = {
    draft: {
      padding: "0.125rem 0.5rem",
      borderRadius: "9999px",
      fontSize: "0.625rem",
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase" as const,
      background: "#fff2d7",
      color: "#9a5b00",
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
      background: "#e7f6e8",
      color: "#237044",
      whiteSpace: "nowrap" as const,
      flexShrink: 0,
    },
    featured: {
      fontSize: "0.75rem",
      color: "#7c3aed",
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
