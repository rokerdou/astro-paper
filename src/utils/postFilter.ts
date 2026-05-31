import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";
import type { BlogPostEntry } from "./runtimePosts";

const postFilter = ({ data }: CollectionEntry<"blog"> | BlogPostEntry) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
