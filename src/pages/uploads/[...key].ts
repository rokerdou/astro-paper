import type { APIRoute } from "astro";
import { getUploadsBucket } from "@/utils/cloudflare";

export const prerender = false;

function normalizeKey(key: string | undefined) {
  if (!key) return null;
  const normalized = key.replace(/^\/+/, "");
  if (normalized.includes("..") || normalized.includes("\\")) return null;
  return normalized.startsWith("uploads/") ? normalized : `uploads/${normalized}`;
}

export const GET: APIRoute = async ({ params, locals }) => {
  const key = normalizeKey(params.key);
  if (!key) return new Response("Not found", { status: 404 });

  const object = await getUploadsBucket(locals).get(key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("X-Content-Type-Options", "nosniff");

  return new Response(object.body, { headers });
};
