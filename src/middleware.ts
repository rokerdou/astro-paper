import { defineMiddleware } from "astro:middleware";

const PUBLIC_CACHE_TTL = 30;
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

export const onRequest = defineMiddleware(async ({ request }, next) => {
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
