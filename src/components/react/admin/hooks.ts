import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = "";

export interface PostTag {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  description: string;
  body?: string;
  author: string;
  pubDatetime: string;
  modDatetime: string | null;
  featured: boolean;
  draft: boolean;
  ogImage: string | null;
  coverImage: string | null;
  canonicalUrl: string | null;
  hideEditPost: boolean;
  timezone: string | null;
  tags: PostTag[];
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    lastPage: number;
  };
  stats: {
    total: number;
    published: number;
    drafts: number;
  };
}

export function usePosts(page = 1, pageSize = 50) {
  return useQuery({
    queryKey: ["posts", page, pageSize],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/posts?page=${page}&pageSize=${pageSize}`);
      const data = await res.json();
      return data as PostsResponse;
    },
  });
}

export function usePost(slug: string | undefined) {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(`${BASE}/api/posts/${slug}`);
      const data = await res.json();
      return data.post as Post;
    },
    enabled: !!slug,
  });
}

export type CreatePostInput = Omit<Partial<Post>, "tags"> & { title: string; tags?: string[] };

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (post: CreatePostInput) => {
      const res = await fetch(`${BASE}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to create post");
      return data as { post: Post };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export type UpdatePostInput = Omit<Partial<Post>, "tags"> & {
  currentSlug: string;
  tags?: string[];
};

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ currentSlug, ...post }: UpdatePostInput) => {
      const res = await fetch(`${BASE}/api/posts/${currentSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to update post");
      return data as { post: Post };
    },
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["post", vars.currentSlug] });
      if (data.post.slug !== vars.currentSlug) {
        qc.invalidateQueries({ queryKey: ["post", data.post.slug] });
      }
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`${BASE}/api/posts/${slug}`, { method: "DELETE" });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/tags`);
      const data = await res.json();
      return data.tags as PostTag[];
    },
  });
}
