import { describe, expect, it } from "vitest";
import {
  InputValidationError,
  optionalWebUrl,
  parseTags,
  requiredString,
} from "./inputValidation";

describe("input validation", () => {
  it("accepts safe web and root-relative URLs", () => {
    expect(optionalWebUrl("https://example.com/a", "URL")).toBe(
      "https://example.com/a"
    );
    expect(optionalWebUrl("/uploads/a.png", "URL")).toBe("/uploads/a.png");
  });

  it("rejects script URLs", () => {
    expect(() => optionalWebUrl("javascript:alert(1)", "URL")).toThrow(
      InputValidationError
    );
  });

  it("normalizes and deduplicates tags", () => {
    expect(parseTags([" Astro ", "Astro", "Cloudflare"])).toEqual([
      "Astro",
      "Cloudflare",
    ]);
  });

  it("requires non-empty strings", () => {
    expect(() => requiredString("  ", "Title", 160)).toThrow(
      "Title is required"
    );
  });
});
