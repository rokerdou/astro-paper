type WorkerCacheStorage = CacheStorage & { default?: Cache };

const BASE_PUBLIC_PATHS = ["/", "/posts/", "/tags/", "/archives/", "/rss.xml"];

function getWorkerCache() {
  return (globalThis.caches as WorkerCacheStorage | undefined)?.default;
}

function cacheKeysForPath(origin: string, path: string) {
  const pathname = path.startsWith("/") ? path : `/${path}`;
  const variants = new Set([pathname]);

  if (pathname !== "/" && !pathname.includes(".") && !pathname.endsWith("/")) {
    variants.add(`${pathname}/`);
  }

  return Array.from(variants).map(
    variant => new Request(new URL(variant, origin).toString(), { method: "GET" })
  );
}

export async function purgePublicCache(request: Request, paths: string[] = []) {
  const cache = getWorkerCache();
  if (!cache) return;

  const origin = new URL(request.url).origin;
  const uniquePaths = Array.from(new Set([...BASE_PUBLIC_PATHS, ...paths]));

  await Promise.all(
    uniquePaths.flatMap(path =>
      cacheKeysForPath(origin, path).map(key => cache.delete(key))
    )
  );
}
