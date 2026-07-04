import type { APIRoute } from "astro";
import { listPostSummaries, listPublishedTags } from "@/db/d1";
import { getD1 } from "@/utils/cloudflare";
import { getRuntimeSiteSettings } from "@/utils/siteSettings";
import { sitemapXml } from "@/utils/sitemap";

export const prerender = false;

function safeOrigin(configuredWebsite: string, request: Request) {
  try {
    const url = new URL(configuredWebsite);
    if (url.protocol === "https:" || url.protocol === "http:")
      return url.origin;
  } catch {
    // Fall back to the active deployment host.
  }
  return new URL(request.url).origin;
}

export const GET: APIRoute = async ({ request, locals }) => {
  const db = getD1(locals);
  const [posts, tags, settings] = await Promise.all([
    listPostSummaries(db),
    listPublishedTags(db),
    getRuntimeSiteSettings(locals),
  ]);
  const origin = safeOrigin(settings.website, request);
  const absolute = (path: string) => new URL(path, `${origin}/`).href;
  const entries = ["/", "/about/", "/posts/", "/tags/", "/archives/"].map(
    path => ({ url: absolute(path) })
  );

  entries.push(
    ...posts.map(post => ({
      url: absolute(`/posts/${encodeURIComponent(post.slug)}/`),
      lastModified: post.mod_datetime || post.pub_datetime,
    })),
    ...tags.map(tag => ({
      url: absolute(`/tags/${encodeURIComponent(tag.slug)}/`),
    }))
  );

  return new Response(sitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300",
    },
  });
};
