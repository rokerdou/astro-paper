import type { Runtime } from "@astrojs/cloudflare";

export type CloudflareLocals = App.Locals & Runtime<{ DB: D1Database }>;

export function getD1(locals: App.Locals) {
  const db = (locals as CloudflareLocals).runtime?.env?.DB;
  if (!db) {
    throw new Error("Cloudflare D1 binding `DB` is not available.");
  }
  return db;
}
