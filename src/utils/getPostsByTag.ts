import type { CollectionEntry } from "astro:content";
import type { BlogPostEntry } from "./runtimePosts";
import getSortedPosts from "./getSortedPosts";
import { slugifyAll } from "./slugify";

const getPostsByTag = (
  posts: (CollectionEntry<"blog"> | BlogPostEntry)[],
  tag: string
) =>
  getSortedPosts(
    posts.filter(post => slugifyAll(post.data.tags).includes(tag))
  );

export default getPostsByTag;
