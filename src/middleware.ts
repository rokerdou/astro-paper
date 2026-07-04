import { defineMiddleware } from "astro:middleware";

const PUBLIC_CACHE_TTL = 30;
const ADMIN_PATHS = [
  /^\/admin(?:\/|$)/,
  /^\/api\/comments(?:\/|$)/,
  /^\/api\/posts(?:\/|$)/,
  /^\/api\/settings(?:\/|$)/,
  /^\/api\/tags(?:\/|$)/,
  /^\/api\/uploads(?:\/|$)/,
];
const CACHEABLE_PATHS = [
  /^\/$/,
  /^\/posts\/?$/,
  /^\/posts\/page\/\d+\/?$/,
  /^\/posts\/[^/]+\/?$/,
  /^\/tags\/?$/,
  /^\/tags\/[^/]+(?:\/\d+)?\/?$/,
  /^\/archives\/?$/,
  /^\/rss\.xml$/,
  /^\/sitemap(?:-index)?\.xml$/,
  /^\/robots\.txt$/,
];
const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
} as const;

type WorkerCacheStorage = CacheStorage & { default?: Cache };
type AdminEnv = { ADMIN_USERNAME?: string; ADMIN_PASSWORD?: string };
type RuntimeLocals = App.Locals & {
  runtime?: {
    env?: AdminEnv;
    ctx?: { waitUntil(promise: Promise<unknown>): void };
  };
};

function getWorkerCache() {
  return (globalThis.caches as WorkerCacheStorage | undefined)?.default;
}

function isCacheableRequest(request: Request) {
  if (request.method !== "GET") return false;
  return CACHEABLE_PATHS.some(pattern =>
    pattern.test(new URL(request.url).pathname)
  );
}

function isAdminRequest(request: Request) {
  const pathname = new URL(request.url).pathname;
  if (
    /^\/api\/posts\/[^/]+\/comments\/?$/.test(pathname) &&
    (request.method === "GET" || request.method === "POST")
  ) {
    return false;
  }
  return ADMIN_PATHS.some(pattern => pattern.test(pathname));
}

function withSecurityHeaders(response: Response) {
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    secured.headers.set(name, value);
  }
  return secured;
}

function constantTimeEqual(left: string, right: string) {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  let difference = leftBytes.length ^ rightBytes.length;
  const length = Math.max(leftBytes.length, rightBytes.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return difference === 0;
}

function readBasicAuth(request: Request) {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Basic ")) return null;
  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(":");
    if (separator === -1) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

function isAuthenticatedAdmin(request: Request, env: AdminEnv) {
  const username = env.ADMIN_USERNAME;
  const password = env.ADMIN_PASSWORD;
  if (!username || !password) return import.meta.env.DEV;
  const auth = readBasicAuth(request);
  return Boolean(
    auth &&
      constantTimeEqual(auth.username, username) &&
      constantTimeEqual(auth.password, password)
  );
}

function unauthorized(message = "Authentication required") {
  return new Response(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Astro Paper Admin"',
      "Cache-Control": "no-store",
    },
  });
}

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  const runtime = (locals as RuntimeLocals).runtime;
  if (isAdminRequest(request) && !isAuthenticatedAdmin(request, runtime?.env ?? {})) {
    return withSecurityHeaders(
      unauthorized(
        import.meta.env.DEV
          ? "Admin credentials are not configured."
          : "Authentication required"
      )
    );
  }

  if (
    isAdminRequest(request) &&
    !["GET", "HEAD", "OPTIONS"].includes(request.method) &&
    request.headers.get("Origin") !== new URL(request.url).origin
  ) {
    return withSecurityHeaders(
      new Response("Invalid request origin", {
        status: 403,
        headers: { "Cache-Control": "no-store" },
      })
    );
  }

  const cache = getWorkerCache();
  if (!cache || !isCacheableRequest(request)) {
    return withSecurityHeaders(await next());
  }

  const cacheUrl = new URL(request.url);
  cacheUrl.search = "";
  cacheUrl.hash = "";
  const cacheKey = new Request(cacheUrl, { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) {
    const response = new Response(cached.body, cached);
    response.headers.set("x-worker-cache", "HIT");
    return withSecurityHeaders(response);
  }

  const response = await next();
  if (response.status !== 200) return withSecurityHeaders(response);

  const publicResponse = new Response(response.body, response);
  publicResponse.headers.set(
    "Cache-Control",
    `public, max-age=0, s-maxage=${PUBLIC_CACHE_TTL}`
  );
  publicResponse.headers.set("x-worker-cache", "MISS");

  const cacheHeaders = new Headers(publicResponse.headers);
  cacheHeaders.set("Cache-Control", `public, max-age=${PUBLIC_CACHE_TTL}`);
  const cacheWrite = cache.put(
    cacheKey,
    new Response(publicResponse.clone().body, {
      headers: cacheHeaders,
      status: publicResponse.status,
      statusText: publicResponse.statusText,
    })
  );
  if (runtime?.ctx) runtime.ctx.waitUntil(cacheWrite);
  else await cacheWrite;

  return withSecurityHeaders(publicResponse);
});
