import { $, Slot, component$, useSignal, useStore } from "@builder.io/qwik";
import { QwikCityMockProvider, useLocation } from "@builder.io/qwik-city";
import { renderToString } from "@builder.io/qwik/server";
import { createDOM } from "@builder.io/qwik/testing";
import { describe, expect, it } from "vitest";
import { Ssgoi, useSsgoiLayoutBoundary } from "../src/lib";
import { useSsgoiRouteBoundary } from "../src/lib/legacy/qwik-city";

const Page = component$(() => {
  const boundary = useSsgoiLayoutBoundary();
  return (
    <section key={boundary.value.key} data-ssgoi-transition={boundary.value.id}>
      Page
    </section>
  );
});

// A listener that captures the boundary makes Qwik pause its computed signal
// and everything it closes over, as an interactive page would.
const InteractivePage = component$(() => {
  const boundary = useSsgoiLayoutBoundary();
  const clicked = useSignal("");
  return (
    <section key={boundary.value.key} data-ssgoi-transition={boundary.value.id}>
      <button onClick$={() => (clicked.value = boundary.value.id)} />
    </section>
  );
});

const CityRoot = component$(() => {
  const location = useLocation();
  return (
    <Ssgoi config$={$(() => ({}))} framework={{ location }}>
      <InteractivePage />
    </Ssgoi>
  );
});

const FeedRoot = component$(() => {
  const location = useLocation();
  return (
    <Ssgoi framework={{ location }}>
      <Slot />
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

describe("useSsgoiLayoutBoundary", () => {
  it("pauses with the Qwik City location store passed as framework", async () => {
    const { html } = await render(
      <QwikCityMockProvider url="http://localhost/posts/1">
        <CityRoot />
      </QwikCityMockProvider>,
    );

    // Dev SSR verifies every context value is serializable before pausing.
    expect(html).toContain('data-ssgoi-transition="/posts/1"');
    const state = html.match(
      /<script type="qwik\/json">([\s\S]*?)<\/script>/,
    )?.[1];
    expect(state).toContain('"/posts/1"');
  });

  it("follows the location store when its url changes", async () => {
    const Root = component$(() => {
      const location = useStore({ url: new URL("http://localhost/posts/1") });
      return (
        <>
          <button
            onClick$={() => {
              location.url = new URL("http://localhost/posts/2");
            }}
          />
          <Ssgoi framework={{ location }}>
            <Page />
          </Ssgoi>
        </>
      );
    });
    const { screen, render, userEvent } = await createDOM();
    await render(<Root />);

    const section = () => screen.querySelector("section")!;
    expect(section().getAttribute("data-ssgoi-transition")).toBe("/posts/1");
    await userEvent("button", "click");
    expect(section().getAttribute("data-ssgoi-transition")).toBe("/posts/2");
  });

  it("keeps a string boundary as the key while the id follows the route", async () => {
    const Shell = component$(() => {
      const boundary = useSsgoiLayoutBoundary("products-layout");
      return (
        <section
          key={boundary.value.key}
          data-key={boundary.value.key}
          data-ssgoi-transition={boundary.value.id}
        />
      );
    });
    const Root = component$(() => {
      const location = useStore({
        url: new URL("http://localhost/products/1"),
      });
      return (
        <>
          <button
            onClick$={() => {
              location.url = new URL("http://localhost/products/2");
            }}
          />
          <Ssgoi framework={{ location }}>
            <Shell />
          </Ssgoi>
        </>
      );
    });
    const { screen, render, userEvent } = await createDOM();
    await render(<Root />);

    const shell = screen.querySelector("section")!;
    expect(shell.getAttribute("data-key")).toBe("products-layout");
    await userEvent("button", "click");
    expect(screen.querySelector("section")).toBe(shell);
    expect(shell.getAttribute("data-ssgoi-transition")).toBe("/products/2");
  });

  it("uses a fixed id from an object boundary", async () => {
    const Feed = component$(() => {
      const boundary = useSsgoiLayoutBoundary({ id: "/feed" });
      return (
        <section
          data-key={boundary.value.key}
          data-ssgoi-transition={boundary.value.id}
        />
      );
    });
    const { html } = await render(
      <QwikCityMockProvider url="http://localhost/feed/7">
        <FeedRoot>
          <Feed />
        </FeedRoot>
      </QwikCityMockProvider>,
    );

    expect(html).toContain('data-key="/feed"');
    expect(html).toContain('data-ssgoi-transition="/feed"');
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
