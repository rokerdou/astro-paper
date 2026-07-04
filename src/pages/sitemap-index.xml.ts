import type { APIRoute } from "astro";
import { getRuntimeSiteSettings } from "@/utils/siteSettings";
import { escapeXml } from "@/utils/sitemap";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  const settings = await getRuntimeSiteSettings(locals);
  let origin = new URL(request.url).origin;
  try {
    const configured = new URL(settings.website);
    if (["http:", "https:"].includes(configured.protocol))
      origin = configured.origin;
  } catch {
    // Use the request origin when the saved setting is invalid.
  }
  const location = escapeXml(new URL("/sitemap.xml", `${origin}/`).href);
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${location}</loc></sitemap></sitemapindex>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } }
  );
};
