export const prerender = false;
import rss from "@astrojs/rss";
import { getPath } from "@/utils/getPath";
import { getRuntimePosts } from "@/utils/runtimePosts";
import { getD1 } from "@/utils/cloudflare";
import { SITE } from "@/config";

export async function GET({ locals }: { locals: App.Locals }) {
  const sortedPosts = await getRuntimePosts(getD1(locals), { limit: 100 });
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getPath(id, filePath),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
    customData: "<ttl>1</ttl>",
  });
}
