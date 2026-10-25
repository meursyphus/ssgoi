import { LitElement, html } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { ref } from "lit/directives/ref.js";
import { SsgoiController, fade, type SsgoiConfig } from "@ssgoi/lit";
import "./style.css";

const config: SsgoiConfig = {
  transitions: [{ on: "/**", transition: fade() }],
};

const pageTitles: Record<string, string> = {
  "/": "Make room for a new idea.",
  "/journal": "The journal",
  "/journal/studio-notes": "A slower way to notice",
};

class FieldnotesApp extends LitElement {
  static properties = { path: { state: true } };
  // `declare` preserves Lit's reactive accessor with native class fields.
  declare path: string;
  readonly ssgoi = new SsgoiController(this, config);

  constructor() {
    super();
    this.path = window.location.pathname;
  }

  // Page removals must be visible to core's document.body observer.
  override createRenderRoot() {
    return this;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.readLocation();
    window.addEventListener("popstate", this.readLocation);
    this.addEventListener("click", this.navigate);
  }

  override disconnectedCallback(): void {
    window.removeEventListener("popstate", this.readLocation);
    this.removeEventListener("click", this.navigate);
    super.disconnectedCallback();
  }

  private readonly readLocation = (): void => {
    this.path = window.location.pathname;
    document.title = `${pageTitles[this.path] ?? "Page not found"} · Fieldnotes`;
  };

  private readonly navigate = (event: MouseEvent): void => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const anchor =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("a[href]")
        : null;
    if (
      !anchor ||
      anchor.hasAttribute("download") ||
      (anchor.target && anchor.target !== "_self")
    )
      return;
    const next = new URL(anchor.href, window.location.href);
    if (next.origin !== window.location.origin || next.hash) return;
    event.preventDefault();
    // Keep the current page/input alive when its own link is selected again.
    if (next.href === window.location.href) return;
    window.history.pushState(null, "", next);
    this.readLocation();
  };

  private home() {
    return html`
      <p class="eyebrow">A small space for curiosity</p>
      <h1>Make room for<br />a new idea.</h1>
      <p class="intro">
        A notebook for the things you notice. Follow a thought, take a detour,
        and come back with something new.
      </p>
      <a class="primary-link" href="/journal"
        >Open the journal <span aria-hidden="true">↗</span></a
      >
      <div class="note-card">
        <span class="note-index">01 / A note to yourself</span>
        <label for="quick-note">What caught your attention today?</label>
        <input
          id="quick-note"
          type="text"
          placeholder="Start with one small observation…"
        />
        <p>
          Try typing, then select Home again. Your input stays while this page
          stays mounted. Visiting another page creates a fresh page on return.
        </p>
      </div>
    `;
  }

  private journal() {
    return html`
      <p class="eyebrow">Collected along the way</p>
      <h1>The journal</h1>
      <p class="intro">
        Some ideas need a little more space. Here is one to sit with.
      </p>
      <a class="story-card" href="/journal/studio-notes">
        <div class="story-art" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <div class="story-copy">
          <span class="note-index">Studio notes · 3 min read</span>
          <h2>A slower way to notice</h2>
          <p>
            On leaving enough space for the ordinary things to become
            interesting.
          </p>
          <span class="text-link"
            >Read the story <span aria-hidden="true">↗</span></span
          >
        </div>
      </a>
      <a class="text-link" href="/">Back to your notebook</a>
    `;
  }

  private story() {
    return html`
      <a class="text-link" href="/journal">← All journal entries</a>
      <p class="eyebrow story-eyebrow">Studio notes · 3 min read</p>
      <h1>A slower way<br />to notice</h1>
      <p class="intro">
        There is a certain kind of idea that only arrives when you stop looking
        for it.
      </p>
      <div class="article-copy">
        <p>
          This morning, the light fell across the desk in a way it had not the
          day before. The same room, the same notebook, a different beginning.
        </p>
        <p>
          We often fill the gaps before they have a chance to become anything.
          Another tab, another task, another thing to listen to. But a pause is
          useful too. It gives the small details a place to land.
        </p>
        <blockquote>Pay attention to what is already here.</blockquote>
        <p>
          Try carrying one observation into the rest of your day. Write it down
          before explaining it. The meaning can come later.
        </p>
      </div>
      <a class="primary-link" href="/"
        >Write a note <span aria-hidden="true">↗</span></a
      >
    `;
  }

  private page() {
    switch (this.path) {
      case "/":
        return this.home();
      case "/journal":
        return this.journal();
      case "/journal/studio-notes":
        return this.story();
      default:
        return html`<p class="eyebrow">A little off the path</p>
          <h1>Page not found</h1>
          <a class="primary-link" href="/">Return home</a>`;
    }
  }

  override render() {
    return html`
      <header class="app-header">
        <a class="brand" href="/" aria-label="Fieldnotes home"
          ><span aria-hidden="true">✳</span> Fieldnotes</a
        >
        <nav aria-label="Main navigation">
          <a href="/" aria-current=${this.path === "/" ? "page" : "false"}
            >Home</a
          >
          <a
            href="/journal"
            aria-current=${this.path.startsWith("/journal") ? "page" : "false"}
            >Journal</a
          >
        </nav>
      </header>
      <main class="transition-root" ${ref(this.ssgoi.ref)}>
        ${keyed(
          this.path,
          html`<article class="page" data-ssgoi-transition=${this.path}>
            ${this.page()}
          </article>`,
        )}
      </main>
      <footer class="app-footer">
        <div class="history-controls" aria-label="Browser history">
          <button @click=${() => window.history.back()}>← Back</button>
          <button @click=${() => window.history.forward()}>Forward →</button>
        </div>
        <span
          >Lit + SSGOI ·
          <output aria-live="polite">${this.ssgoi.state.status}</output></span
        >
      </footer>
    `;
  }
}

customElements.define("fieldnotes-app", FieldnotesApp);
