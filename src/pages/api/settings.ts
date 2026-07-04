import type { APIRoute } from "astro";
import { listSiteSettings, replaceSiteSettings } from "@/db/d1";
import { getD1 } from "@/utils/cloudflare";
import { purgePublicCache } from "@/utils/cache";
import {
  sanitizeSiteSettings,
  validateSiteSettings,
  toSiteSettingsRecord,
} from "@/utils/siteSettings";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const rows = await listSiteSettings(getD1(locals));
  const settings = sanitizeSiteSettings(
    Object.fromEntries(rows.map(row => [row.key, row.value]))
  );

  return Response.json(
    { settings },
    { headers: { "Cache-Control": "no-store" } }
  );
};

export const PUT: APIRoute = async ({ request, locals }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  let settings;
  try {
    settings = validateSiteSettings(body);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Invalid settings" },
      { status: 400 }
    );
  }
  await replaceSiteSettings(getD1(locals), toSiteSettingsRecord(settings));
  await purgePublicCache(request);

  return Response.json(
    { settings },
    { headers: { "Cache-Control": "no-store" } }
  );
};
