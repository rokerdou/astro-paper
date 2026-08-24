export const vars = {
  font: `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Noto Sans SC", sans-serif`,
  mono: `ui-monospace, "SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace`,
};

export const input: React.CSSProperties = {
  width: "100%",
  minHeight: "2.5rem",
  padding: "0.5rem 0.75rem",
  border: "1px solid var(--admin-border, #e5e5e5)",
  borderRadius: "var(--admin-radius-standard, 8px)",
  background: "var(--admin-background, #fff)",
  color: "var(--admin-foreground, #000)",
  fontSize: "0.875rem",
  lineHeight: 1.4286,
  transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: vars.font,
};

export const label: React.CSSProperties = {
  display: "block",
  fontSize: "0.625rem",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  color: "var(--admin-muted-foreground, #666)",
  marginBottom: "0.5rem",
};

export const card: React.CSSProperties = {
  background: "var(--admin-background, #fff)",
  border: "1px solid var(--admin-border, #e5e5e5)",
  borderRadius: "var(--admin-radius-relaxed, 10px)",
  padding: "1rem",
  boxShadow: "none",
  transition: "box-shadow 0.2s, border-color 0.2s, background 0.2s",
};

export const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.375rem",
  minHeight: "2.5rem",
  padding: "0.5rem 0.875rem",
  border: "none",
  borderRadius: "var(--admin-radius-standard, 8px)",
  background: "var(--admin-primary, #000)",
  color: "var(--admin-primary-foreground, #fff)",
  fontSize: "0.8125rem",
  fontWeight: 500,
  cursor: "pointer",
  transition: "background 0.15s, box-shadow 0.15s",
  fontFamily: vars.font,
  lineHeight: 1,
  boxShadow: "var(--admin-shadow-shallow, 0 1px 2px rgba(0,0,0,.05))",
};

export const btnSecondary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.375rem",
  minHeight: "2.5rem",
  padding: "0.5rem 0.875rem",
  border: "1px solid var(--admin-border, #e5e5e5)",
  borderRadius: "var(--admin-radius-standard, 8px)",
  background: "var(--admin-background, #fff)",
  color: "var(--admin-foreground, #000)",
  fontSize: "0.8125rem",
  fontWeight: 500,
  cursor: "pointer",
  textDecoration: "none",
  transition: "border-color 0.15s, background 0.15s",
  fontFamily: vars.font,
  lineHeight: 1,
};

export const btnDanger: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "2.5rem",
  padding: "0.375rem 0.75rem",
  border: "1px solid transparent",
  borderRadius: "var(--admin-radius-standard, 8px)",
  color: "#dc2626",
  background: "transparent",
  fontSize: "0.8125rem",
  fontWeight: 500,
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
      borderRadius: "var(--admin-radius-tight, 6px)",
      fontSize: "0.625rem",
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase" as const,
      background: "#fafafa",
      border: "1px solid var(--admin-border, #e5e5e5)",
      color: "#666666",
      whiteSpace: "nowrap" as const,
      flexShrink: 0,
    },
    published: {
      padding: "0.125rem 0.5rem",
      borderRadius: "var(--admin-radius-tight, 6px)",
      fontSize: "0.625rem",
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase" as const,
      background: "rgba(16, 185, 129, 0.1)",
      border: "1px solid rgba(16, 185, 129, 0.2)",
      color: "#047857",
      whiteSpace: "nowrap" as const,
      flexShrink: 0,
    },
    featured: {
      fontSize: "0.75rem",
      color: "var(--admin-foreground, #000)",
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
