import { useState } from "preact/hooks";
import { LocationProvider, Route, Router, useLocation } from "preact-iso";
import {
  Ssgoi,
  SsgoiRouteBoundary,
  useSsgoiTransition,
  type SsgoiConfig,
} from "@ssgoi/preact";
import { fade } from "@ssgoi/preact/view-transitions";

// A stable provider and config survive every URL change.
const config: SsgoiConfig = {
  transitions: [{ on: "/**", transition: fade() }],
};

function TransitionStatus() {
  const state = useSsgoiTransition();
  return (
    <output
      class="transition-status"
      aria-live="polite"
      data-transition-status={state.status}
    >
      {state.status === "idle" ? "Ready" : `${state.from} → ${state.to}`}
    </output>
  );
}

function Home() {
  const [count, setCount] = useState(0);
  const [note, setNote] = useState("");
  const { query } = useLocation();
  return (
    <>
      <p class="eyebrow">01 / Start here</p>
      <h1>
        Keep your router.
        <br />
        Add the motion.
      </h1>
      <p class="lede">
        This starter uses native Preact, preact-iso links, and SSGOI page
        transitions.
      </p>
      <div class="card">
        <h2>One page, one lifetime</h2>
        <label>
          Page note
          <input
            value={note}
            onInput={(event) => setNote(event.currentTarget.value)}
            placeholder="Preserved on query-only navigation"
          />
        </label>
        <button onClick={() => setCount((value) => value + 1)}>
          Page count: {count}
        </button>
        <p>
          View:{" "}
          <strong>
            {query.view === "compact" ? "compact" : "comfortable"}
          </strong>
        </p>
        <a href={query.view === "compact" ? "/" : "/?view=compact"}>
          Toggle view query
        </a>
        <p class="hint">
          The pathname stays the same, so the note and count survive this link.
          A different page unmounts them.
        </p>
      </div>
      <a class="primary-link" href="/about">
        Explore the setup <span aria-hidden="true">→</span>
      </a>
    </>
  );
}

function About() {
  return (
    <>
      <p class="eyebrow">02 / How it works</p>
      <h1>
        The URL owns
        <br />
        the journey.
      </h1>
      <p class="lede">
        Real links update browser history. Back and Forward restore the matching
        page through the same transition boundary.
      </p>
      <div class="card">
        <h2>Three pieces</h2>
        <ol>
          <li>
            <code>LocationProvider</code> handles same-origin links and browser
            history.
          </li>
          <li>
            <code>Ssgoi</code> stays mounted around the routed region.
          </li>
          <li>
            <code>SsgoiRouteBoundary</code> keys the page DOM by pathname.
          </li>
        </ol>
        <p>
          The shell draft above the pages stays mounted. Page-local state resets
          when its page is replaced.
        </p>
      </div>
      <a class="primary-link" href="/">
        Return home <span aria-hidden="true">→</span>
      </a>
    </>
  );
}

function NotFound() {
  return (
    <>
      <p class="eyebrow">404</p>
      <h1>Page not found.</h1>
      <a class="primary-link" href="/">
        Return home
      </a>
    </>
  );
}

function RoutedPages() {
  const { path } = useLocation();
  return (
    <SsgoiRouteBoundary id={path} as="main" class="page">
      <Router>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route default component={NotFound} />
      </Router>
    </SsgoiRouteBoundary>
  );
}

function Shell() {
  const { path } = useLocation();
  const [draft, setDraft] = useState("");
  return (
    <div class="app-shell">
      <header>
        <a class="brand" href="/">
          SSGOI <span>/ Preact</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="/" aria-current={path === "/" ? "page" : undefined}>
            Home
          </a>
          <a
            href="/about"
            aria-current={path === "/about" ? "page" : undefined}
          >
            About
          </a>
          <button onClick={() => history.back()}>Back</button>
          <button onClick={() => history.forward()}>Forward</button>
        </nav>
      </header>
      <label class="shell-draft">
        Shell draft
        <input
          value={draft}
          onInput={(event) => setDraft(event.currentTarget.value)}
          placeholder="Stays while you visit other pages"
        />
      </label>
      <Ssgoi config={config}>
        <TransitionStatus />
        <RoutedPages />
      </Ssgoi>
      <footer>Native Preact · URL routing · Shared SSGOI engine</footer>
    </div>
  );
}

export function App() {
  return (
    <LocationProvider>
      <Shell />
    </LocationProvider>
  );
}
