import { nativePlatform } from "../src/native-platform";
import { fade, slide } from "../src/view-transitions";
import type { SsgoiConfig } from "../src/types";

test("middleware and device-dependent rules share web semantics", () => {
  const config: SsgoiConfig = {
    middleware: (from, to) => ({
      from: from.replace("/en", ""),
      to: to.replace("/en", ""),
    }),
    transitions: ({ isMobile }) => [
      {
        from: "/posts",
        to: "/posts/*",
        transition: isMobile ? slide() : fade(),
      },
    ],
  };
  expect(
    nativePlatform.prepare(config, "/en/posts", "/en/posts/42", "forward", 390)
      ?.kind,
  ).toBe("slide");
  expect(
    nativePlatform.prepare(
      config,
      "/en/posts/42",
      "/en/posts",
      "forward",
      1000,
    ),
  ).toMatchObject({ kind: "fade", direction: "backward" });
});

test("unsupported web transitions and scroll restoration fail explicitly", () => {
  const web = {
    transitions: [{ on: "/**", transition: { animation() {} } }],
  } as unknown as SsgoiConfig;
  expect(() => nativePlatform.prepare(web, "/a", "/b", "forward", 390)).toThrow(
    "@ssgoi/react-native/view-transitions",
  );
  const scroll = {
    transitions: [
      {
        on: "/**",
        transition: slide(),
        preserveScroll: { from: false, to: true },
      },
    ],
  } as unknown as SsgoiConfig;
  expect(() =>
    nativePlatform.prepare(scroll, "/a", "/b", "forward", 390),
  ).toThrow("preserveScroll");
});

test("no matching rule settles without an animation", () => {
  expect(
    nativePlatform.prepare(
      { transitions: [{ on: "/posts", transition: slide() }] },
      "/a",
      "/b",
      "forward",
      390,
    ),
  ).toBeNull();
});
