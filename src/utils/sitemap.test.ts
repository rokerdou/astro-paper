import { describe, expect, it } from "vitest";
import { escapeXml, sitemapXml } from "./sitemap";

describe("sitemap XML", () => {
  it("escapes URL values", () => {
    expect(escapeXml("https://example.com/?a=1&b=<x>")).toBe(
      "https://example.com/?a=1&amp;b=&lt;x&gt;"
    );
  });

  it("renders last modified dates", () => {
    const xml = sitemapXml([
      { url: "https://example.com/post/", lastModified: "2026-07-04" },
    ]);
    expect(xml).toContain("<lastmod>2026-07-04</lastmod>");
  });
});
