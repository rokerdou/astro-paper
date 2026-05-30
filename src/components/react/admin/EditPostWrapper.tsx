import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePost } from "./hooks";
import { vars, spinnerStyle } from "./styles";
import PostEditor from "./PostEditor";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });

function EditPostInner({ slug }: { slug: string }) {
  const { data: post, isLoading, error } = usePost(slug);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
        <div style={{
          width: "1.5rem", height: "1.5rem", border: "2px solid var(--border)",
          borderTopColor: "var(--accent)", borderRadius: "50%",
          animation: "admin-spin 0.6s linear infinite",
        }} />
        <style>{spinnerStyle}</style>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{
        textAlign: "center",
        padding: "4rem 2rem",
        color: "var(--muted-foreground)",
        background: "var(--muted)",
        borderRadius: "0.75rem",
        border: "1px solid var(--border)",
        fontFamily: vars.font,
      }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem", opacity: 0.5 }}>404</div>
        <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.25rem" }}>
          Post not found
        </div>
        <div style={{ fontSize: "0.8125rem" }}>
          The post "{slug}" does not exist or has been deleted.
        </div>
      </div>
    );
  }

  return <PostEditor post={post} />;
}

export default function EditPostWrapper({ slug }: { slug: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <EditPostInner slug={slug} />
    </QueryClientProvider>
  );
}
