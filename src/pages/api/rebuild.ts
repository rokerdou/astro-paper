import type { APIRoute } from "astro";
import { execSync } from "child_process";

export const prerender = false;

let rebuilding = false;

export const POST: APIRoute = async () => {
  if (rebuilding) {
    return new Response(JSON.stringify({ status: "already_rebuilding" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  rebuilding = true;

  try {
    execSync("pnpm build", {
      stdio: "pipe",
      timeout: 120_000,
      env: { ...process.env, FORCE_COLOR: "0" },
    });
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Build failed";
    return new Response(JSON.stringify({ status: "error", error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    rebuilding = false;
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ rebuilding }), {
    headers: { "Content-Type": "application/json" },
  });
};
