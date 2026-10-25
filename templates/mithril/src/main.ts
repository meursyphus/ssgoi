import m from "mithril";
import { Ssgoi, createSsgoi, fade, type SsgoiConfig } from "@ssgoi/mithril";
import { SsgoiRouteBoundary } from "@ssgoi/mithril/router";
import "./style.css";

const controller = createSsgoi();
const config: SsgoiConfig = {
  transitions: [{ on: "/**", transition: fade() }],
};

const link = (href: string, text: string) => m(m.route.Link, { href }, text);

const Home: m.Component = {
  view: () =>
    m("article.page", { "data-page": "home" }, [
      m("p.eyebrow", "ONE SMALL ROUTER. SMOOTH PAGE CHANGES."),
      m("h1", "Make your next move."),
      m(
        "p.intro",
        "A working Mithril example with SSGOI page transitions. Open a detail page, change its route parameter, then use your browser’s back button.",
      ),
      m("div.cards", [
        m(m.route.Link, { href: "/items/1", class: "card peach" }, [
          m("span.number", "01"),
          m("h2", "First detail"),
          m("p", "A fresh page and its own local counter."),
          m("span.arrow", "Explore →"),
        ]),
        m(m.route.Link, { href: "/items/2", class: "card blue" }, [
          m("span.number", "02"),
          m("h2", "Second detail"),
          m("p", "Same component, a different route key."),
          m("span.arrow", "Explore →"),
        ]),
      ]),
    ]),
};

const Item: m.ClosureComponent<{ id: string }> = () => {
  let count = 0;
  return {
    view: ({ attrs }) =>
      m("article.page", { "data-page": `item-${attrs.id}` }, [
        m("p.eyebrow", `DETAIL / ${attrs.id.padStart(2, "0")}`),
        m("h1", `Item ${attrs.id}`),
        m(
          "p.intro",
          "Both detail routes use this same component. The boundary keys its DOM by the resolved path, so each page keeps its own content during the outgoing animation.",
        ),
        m("div.counter", [
          m("span", "Local page counter"),
          m("strong", { "data-counter": "" }, String(count)),
          m("button", { onclick: () => count++ }, "Increment"),
        ]),
        m("div.actions", [
          link(`/items/${attrs.id === "1" ? "2" : "1"}`, "Next detail →"),
          link("/", "← All items"),
        ]),
      ]),
  };
};

const About: m.Component = {
  view: () =>
    m("article.page", { "data-page": "about" }, [
      m("p.eyebrow", "HOW IT WORKS"),
      m("h1", "A stable shell. A new page."),
      m(
        "p.intro",
        "The navigation stays mounted. SSGOI retains the outgoing DOM while Mithril renders the next keyed page, then removes it when the animation settles.",
      ),
      m(
        "p",
        "Use browser Back and Forward to revisit the pages. The status in the header follows the provider’s actual transition lifecycle.",
      ),
      link("/", "Back to the collection →"),
    ]),
};

const Layout: m.Component = {
  view: ({ children }) =>
    m("div.shell", [
      m("header", [
        m("a.brand", { href: "#!/" }, [
          m("span.brand-mark", "S"),
          "SSGOI ",
          m("span.muted", "× Mithril"),
        ]),
        m("nav", [link("/", "Collection"), link("/about", "About")]),
        m(
          "output.status",
          { "data-transition-status": "", "aria-live": "polite" },
          controller.getTransitionState().status,
        ),
      ]),
      m("section.stage", children),
      m("footer", "Mithril route transitions · SSGOI 7.4.1"),
    ]),
};

const render: m.RouteResolver["render"] = (page) =>
  m(Ssgoi, { config, controller }, m(Layout, m(SsgoiRouteBoundary, page)));

const root = document.getElementById("app")!;
m.route(root, "/", {
  "/": { onmatch: () => Home, render },
  "/items/:id": { onmatch: () => Item, render },
  "/about": { onmatch: () => About, render },
});

// Vite may replace this module while developing. Unmounting calls the
// provider's cleanup and removes the router's listeners before the next run.
if (import.meta.hot) import.meta.hot.dispose(() => m.mount(root, null));
