import { $, Slot, component$, useSignal, useStore } from "@builder.io/qwik";
import { QwikCityMockProvider, useLocation } from "@builder.io/qwik-city";
import { renderToString } from "@builder.io/qwik/server";
import { createDOM } from "@builder.io/qwik/testing";
import { describe, expect, it } from "vitest";
import { Ssgoi, useSsgoiLayoutBoundary } from "../src/lib";
import { useSsgoiRouteBoundary } from "../src/lib/legacy/qwik-city";

const TOP_LEVEL = ["/posts", "/products"];
const config$ = $(() => ({
  layouts: [
    { paths: TOP_LEVEL },
    {
      paths: "/**",
      except: TOP_LEVEL,
      layouts: [{ paths: "/products/*/**" }],
    },
  ],
}));

// A listener that captures the boundary makes Qwik pause its computed signal
// and everything it closes over, as an interactive layout would.
const Layout = component$(() => {
  const boundary = useSsgoiLayoutBoundary();
  const clicked = useSignal("");
  return (
    <main
      key={boundary.value.key}
      data-key={boundary.value.key}
      data-ssgoi-transition={boundary.value.id}
    >
      <button onClick$={() => (clicked.value = boundary.value.id)} />
      <Slot />
    </main>
  );
});

const Page = component$(() => {
  const boundary = useSsgoiLayoutBoundary();
  return (
    <section
      key={boundary.value.key}
      data-key={boundary.value.key}
      data-ssgoi-transition={boundary.value.id}
    />
  );
});

const CityRoot = component$<{ layouts?: boolean }>(({ layouts }) => {
  const location = useLocation();
  return (
    <Ssgoi config$={layouts ? config$ : undefined} framework={{ location }}>
      <Layout>
        <Page />
      </Layout>
    </Ssgoi>
  );
});

const render = (jsx: Parameters<typeof renderToString>[0]) =>
  renderToString(jsx, {
    containerTagName: "div",
    qwikLoader: { include: "never" },
    // Test builds inline QRLs; give each symbol a chunk so state can pause.
    symbolMapper: (symbol) => [symbol, `/${symbol}.js`],
  });

const renderCity = (url: string, layouts = true) =>
  render(
    <QwikCityMockProvider url={`http://localhost${url}`}>
      <CityRoot layouts={layouts} />
    </QwikCityMockProvider>,
  );

describe("useSsgoiLayoutBoundary", () => {
  it("keys each depth by its config.layouts scope on the server", async () => {
    const { html } = await renderCity("/products/shoes/42");

    // Dev SSR verifies every context value is serializable before pausing.
    expect(html).toContain('<main data-key="1"');
    expect(html).toContain('data-key="1.0/shoes"');
    expect(
      html.match(/data-ssgoi-transition="\/products\/shoes\/42"/g),
    ).toHaveLength(2);
    const state = html.match(
      /<script type="qwik\/json">([\s\S]*?)<\/script>/,
    )?.[1];
    expect(state).toContain('"/products/shoes/42"');
  });

  it("falls back to the route path below the chain", async () => {
    const { html } = await renderCity("/posts");
    expect(html).toContain('<main data-key="0"');
    expect(html).toContain('<section data-key="/posts"');
  });

  it("keys every depth by the route path without config.layouts", async () => {
    const { html } = await renderCity("/products/shoes/42", false);
    expect(html.match(/data-key="\/products\/shoes\/42"/g)).toHaveLength(2);
  });

  it("keeps an outer scope mounted while an inner key follows the location store", async () => {
    const Root = component$(() => {
      const location = useStore({
        url: new URL("http://localhost/products/shoes/1"),
      });
      return (
        <>
          <button
            id="next"
            onClick$={() => {
              location.url = new URL("http://localhost/products/hats/2");
            }}
          />
          <Ssgoi config$={config$} framework={{ location }}>
            <Layout>
              <Page />
            </Layout>
          </Ssgoi>
        </>
      );
    });
    const { screen, render, userEvent } = await createDOM();
    await render(<Root />);

    const main = screen.querySelector("main")!;
    expect(screen.querySelector("section")!.getAttribute("data-key")).toBe(
      "1.0/shoes",
    );
    await userEvent("#next", "click");
    expect(screen.querySelector("main")).toBe(main);
    expect(main.getAttribute("data-ssgoi-transition")).toBe("/products/hats/2");
    expect(screen.querySelector("section")!.getAttribute("data-key")).toBe(
      "1.0/hats",
    );
  });

  it("throws without a framework", async () => {
    await expect(
      render(
        <Ssgoi>
          <Page />
        </Ssgoi>,
      ),
    ).rejects.toThrow(/^SSGOI: useSsgoiLayoutBoundary requires a framework/);
  });
});

describe("deprecated useSsgoiRouteBoundary", () => {
  it("still reads Qwik City's location without a framework", async () => {
    const CityPage = component$(() => {
      const boundary = useSsgoiRouteBoundary();
      return (
        <section
          key={boundary.value.key}
          data-ssgoi-transition={boundary.value.id}
        >
          Page
        </section>
      );
    });
    const { html } = await render(
      <QwikCityMockProvider url="http://localhost/posts/3">
        <Ssgoi>
          <CityPage />
        </Ssgoi>
      </QwikCityMockProvider>,
    );

    expect(html).toContain('data-ssgoi-transition="/posts/3"');
  });
});
