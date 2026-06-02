import { defineMiddleware } from "astro:middleware";

const PUBLIC_CACHE_TTL = 30;
const ADMIN_PATHS = [/^\/admin(?:\/|$)/, /^\/api\/posts(?:\/|$)/, /^\/api\/tags(?:\/|$)/];
const CACHEABLE_PATHS = [
  /^\/$/,
  /^\/posts\/?$/,
  /^\/posts\/page\/\d+\/?$/,
  /^\/posts\/[^/]+\/?$/,
  /^\/tags\/?$/,
  /^\/tags\/[^/]+(?:\/\d+)?\/?$/,
  /^\/archives\/?$/,
  /^\/rss\.xml$/,
];

type WorkerCacheStorage = CacheStorage & { default?: Cache };
type AdminEnv = {
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
};
type RuntimeLocals = App.Locals & { runtime?: { env?: AdminEnv } };

function getWorkerCache() {
  return (globalThis.caches as WorkerCacheStorage | undefined)?.default;
}

function canUseWorkerCache() {
  return Boolean(getWorkerCache());
}

function isCacheableRequest(request: Request) {
  if (request.method !== "GET") return false;

  const url = new URL(request.url);
  return CACHEABLE_PATHS.some(pattern => pattern.test(url.pathname));
}

function isAdminRequest(request: Request) {
  const url = new URL(request.url);
  return ADMIN_PATHS.some(pattern => pattern.test(url.pathname));
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

  if (!username || !password) {
    return import.meta.env.DEV;
  }

  const auth = readBasicAuth(request);
  return Boolean(auth && auth.username === username && auth.password === password);
}

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  const env = (locals as RuntimeLocals).runtime?.env ?? {};

  if (isAdminRequest(request) && !isAuthenticatedAdmin(request, env)) {
    return unauthorized(
      import.meta.env.DEV
        ? "Admin credentials are not configured."
        : "Authentication required"
    );
  }

  if (!canUseWorkerCache() || !isCacheableRequest(request)) {
    return next();
  }

  const cache = getWorkerCache();
  if (!cache) return next();
  const cacheKey = new Request(request.url, { method: "GET" });
  const cached = await cache.match(cacheKey);

  if (cached) {
    const response = new Response(cached.body, cached);
    response.headers.set("x-worker-cache", "HIT");
    return response;
  }

  const response = await next();
  if (response.status !== 200) return response;

  const cachedResponse = new Response(response.body, response);
  cachedResponse.headers.set(
    "Cache-Control",
    `public, max-age=0, s-maxage=${PUBLIC_CACHE_TTL}`
  );
  cachedResponse.headers.set("x-worker-cache", "MISS");

  await cache.put(
    cacheKey,
    new Response(cachedResponse.clone().body, {
      headers: (() => {
        const headers = new Headers(cachedResponse.headers);
        headers.set("Cache-Control", `public, max-age=${PUBLIC_CACHE_TTL}`);
        return headers;
      })(),
      status: cachedResponse.status,
      statusText: cachedResponse.statusText,
    })
  );

  return cachedResponse;
});
