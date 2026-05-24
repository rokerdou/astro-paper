import type { Loader } from "astro/loaders";
import { getDb } from "@/db";
import { posts, tags, postsTags } from "@/db/schema";

export function dbLoader(): Loader {
  return {
    name: "db-loader",
    load: async ({ store, generateDigest, renderMarkdown, parseData, logger }) => {
      try {
        const db = getDb();

        const allPosts = db.select().from(posts).all();
        const allTags = db.select().from(tags).all();
        const allPostsTags = db.select().from(postsTags).all();

        const tagMap = new Map(allTags.map(t => [t.id, t.name]));

        const postTagMap = new Map<number, string[]>();
        for (const pt of allPostsTags) {
          const list = postTagMap.get(pt.postId) || [];
          const tagName = tagMap.get(pt.tagId);
          if (tagName) list.push(tagName);
          postTagMap.set(pt.postId, list);
        }

        for (const post of allPosts) {
          const data = {
            author: post.author,
            pubDatetime: new Date(post.pubDatetime),
            modDatetime: post.modDatetime ? new Date(post.modDatetime) : null,
            title: post.title,
            featured: post.featured || undefined,
            draft: post.draft || undefined,
            tags: postTagMap.get(post.id) || ["others"],
            ogImage: post.ogImage || undefined,
            coverImage: post.coverImage || undefined,
            description: post.description,
            canonicalURL: post.canonicalUrl || undefined,
            hideEditPost: post.hideEditPost || undefined,
            timezone: post.timezone || undefined,
          };

          const parsedData = await parseData({ id: post.slug, data });

          const rendered = await renderMarkdown(post.body);

          store.set({
            id: post.slug,
            data: parsedData,
            body: post.body,
            rendered,
            digest: generateDigest(post.updatedAt),
          });
        }

        logger.info(`Loaded ${allPosts.length} posts from database`);
      } catch (e) {
        logger.error("Error loading from database: " + String(e));
      }
    },
  };
}
