import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePost } from "./hooks";
import PostEditor from "./PostEditor";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });

function EditPostInner({ slug }: { slug: string }) {
  const { data: post, isLoading, error } = usePost(slug);

  if (isLoading) return <div style={{ padding: "2rem" }}>Loading post...</div>;
  if (error || !post) return <div style={{ padding: "2rem", color: "#ef4444" }}>Post not found.</div>;

  return <PostEditor post={post} />;
}

export default function EditPostWrapper({ slug }: { slug: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <EditPostInner slug={slug} />
    </QueryClientProvider>
  );
}
