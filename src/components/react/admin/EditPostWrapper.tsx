import { usePost } from "./hooks";
import PostEditor from "./PostEditor";

interface Props {
  slug: string;
}

export default function EditPostWrapper({ slug }: Props) {
  const { data: post, isLoading, error } = usePost(slug);

  if (isLoading) return <div style={{ padding: "2rem" }}>Loading post...</div>;
  if (error || !post) return <div style={{ padding: "2rem", color: "#ef4444" }}>Post not found.</div>;

  return <PostEditor post={post} />;
}
