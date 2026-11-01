import { describe, expect, it } from "vitest";
import type { LayoutScope } from "../runtime/types";
import { resolveLayoutChain } from "./layout-chain";

const TOP_LEVEL = ["/", "/search", "/profile"];
const layouts: LayoutScope[] = [
  { paths: TOP_LEVEL },
  {
    paths: "/**",
    except: TOP_LEVEL,
    layouts: [
      { paths: "/products/**" },
      {
        paths: "/projects/:id/**",
        layouts: [{ paths: "/projects/*/files/[file]" }],
      },
    ],
  },
];

describe("resolveLayoutChain", () => {
  it("returns no chain without layouts or without a match", () => {
    expect(resolveLayoutChain(undefined, "/posts")).toEqual([]);
    expect(resolveLayoutChain([], "/posts")).toEqual([]);
    expect(resolveLayoutChain([{ paths: "/a/**" }], "/b")).toEqual([]);
  });

  it("gives every page of one sibling scope the same entry", () => {
    expect(resolveLayoutChain(layouts, "/")).toEqual(["0"]);
    expect(resolveLayoutChain(layouts, "/search?q=1")).toEqual(["0"]);
    expect(resolveLayoutChain(layouts, "/profile/")).toEqual(["0"]);
  });

  it("takes the first matching sibling and honors except", () => {
    expect(resolveLayoutChain(layouts, "/posts/1")).toEqual(["1"]);
    expect(
      resolveLayoutChain([{ paths: "/**" }, { paths: "/search" }], "/search"),
    ).toEqual(["0"]);
    expect(
      resolveLayoutChain([{ paths: "/**", except: "/search" }], "/search"),
    ).toEqual([]);
  });

  it("descends into nested scopes and stops where none matches", () => {
    expect(resolveLayoutChain(layouts, "/products")).toEqual(["1", "1.0"]);
    expect(resolveLayoutChain(layouts, "/products/fashion")).toEqual([
      "1",
      "1.0",
    ]);
    expect(resolveLayoutChain(layouts, "/posts")).toEqual(["1"]);
  });

  it("keys an instance by single-segment captures, not by a ** tail", () => {
    const one = resolveLayoutChain(layouts, "/projects/1/members");
    expect(one).toEqual(["1", "1.1/1"]);
    expect(resolveLayoutChain(layouts, "/projects/1")).toEqual(one);
    expect(resolveLayoutChain(layouts, "/projects/2/members")).toEqual([
      "1",
      "1.1/2",
    ]);
    expect(resolveLayoutChain(layouts, "/projects/1/files/a")).toEqual([
      "1",
      "1.1/1",
      "1.1.0/1/a",
    ]);
  });
});
