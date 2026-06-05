import type { Runtime } from "@astrojs/cloudflare";

export type CloudflareLocals = App.Locals & Runtime<{ DB: D1Database }>;
export type UploadsLocals = App.Locals & Runtime<{ UPLOADS: R2Bucket }>;

export function getD1(locals: App.Locals) {
  const db = (locals as CloudflareLocals).runtime?.env?.DB;
  if (!db) {
    throw new Error("Cloudflare D1 binding `DB` is not available.");
  }
  return db;
}

export function getUploadsBucket(locals: App.Locals) {
  const bucket = (locals as UploadsLocals).runtime?.env?.UPLOADS;
  if (!bucket) {
    throw new Error("Cloudflare R2 binding `UPLOADS` is not available.");
  }
  return bucket;
}
