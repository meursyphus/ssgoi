import { describe, expect, it } from "vitest";
import { matchPath, normalizePath } from "./path-pattern";

describe("path patterns", () => {
  it("normalizes URLs, query/hash, and slash variants", () => {
    expect(normalizePath("https://ssgoi.dev//posts/1/?sort=top#comments")).toBe(
      "/posts/1",
    );
    expect(matchPath("posts/1?sort=top#comments", "/posts/:id")).toBe(true);
    expect(matchPath("/posts/1/", "posts/[id]")).toBe(true);
    expect(matchPath("/posts/1", "/posts/{id}")).toBe(true);
    expect(matchPath("/", "")).toBe(true);
  });

  it("makes * exactly one segment", () => {
    expect(matchPath("/posts/1", "/posts/*")).toBe(true);
    expect(matchPath("/posts", "/posts/*")).toBe(false);
    expect(matchPath("/posts/1/comments", "/posts/*")).toBe(false);
  });

  it("makes a suffix ** zero or more segments", () => {
    expect(matchPath("/", "/**")).toBe(true);
    expect(matchPath("/posts", "/posts/**")).toBe(true);
    expect(matchPath("/posts/1", "/posts/**")).toBe(true);
    expect(matchPath("/posts/1/comments", "/posts/**")).toBe(true);
    expect(matchPath("/postscript", "/posts/**")).toBe(false);
    expect(matchPath("/posts/1/comments", "/posts/**/comments")).toBe(false);
  });

  it("keeps bare * as a compatibility alias for /**", () => {
    expect(matchPath("/", "*")).toBe(true);
    expect(matchPath("/anything/deep", "*")).toBe(true);
  });
});
