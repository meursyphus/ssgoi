import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  installDocumentScrollGuard,
  releaseDocumentScrollGuard,
} from "./document-scroll-guard";

type ClickListener = (event: Event) => void;

function createFakeDocument(options: { scrollTop?: number } = {}) {
  let clickListener: ClickListener | null = null;
  const children: FakeGuard[] = [];
  const scrollingElement = {
    clientHeight: 844,
    scrollHeight: 7243,
    scrollTop: options.scrollTop ?? 3600,
  };

  class FakeGuard {
    attributes = new Map<string, string>();
    isConnected = false;
    style: Record<string, string> = {};

    remove(): void {
      const index = children.indexOf(this);
      if (index >= 0) children.splice(index, 1);
      this.isConnected = false;
    }

    setAttribute(name: string, value: string): void {
      this.attributes.set(name, value);
    }
  }

  const document = {
    URL: "https://example.com/feed",
    baseURI: "https://example.com/feed",
    body: {
      appendChild(guard: FakeGuard) {
        children.push(guard);
        guard.isConnected = true;
        return guard;
      },
    },
    scrollingElement,
    createElement: () => new FakeGuard(),
    addEventListener(type: string, listener: ClickListener) {
      if (type === "click") clickListener = listener;
    },
  } as unknown as Document;

  const click = (href: string) => {
    const anchor = {
      href,
      target: "",
      closest: () => anchor,
      hasAttribute: () => false,
    };
    clickListener?.({
      target: anchor,
      button: 0,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    } as unknown as Event);
  };

  return { children, click, document, scrollingElement };
}

describe("document scroll guard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("holds the current document extent for a link navigation, then releases it", () => {
    const { children, click, document } = createFakeDocument();

    installDocumentScrollGuard(document);
    click("https://example.com/detail");

    expect(children).toHaveLength(1);
    expect(children[0]!.attributes.get("data-ssgoi-scroll-guard")).toBe("");
    expect(children[0]!.style).toMatchObject({
      position: "absolute",
      top: "7242px",
      visibility: "hidden",
    });

    releaseDocumentScrollGuard(document);
    expect(children).toHaveLength(0);
  });

  it("does not guard a document that is already at the top", () => {
    const { children, click, document } = createFakeDocument({ scrollTop: 0 });

    installDocumentScrollGuard(document);
    click("https://example.com/detail");

    expect(children).toHaveLength(0);
  });

  it("releases the guard if the click does not produce an incoming page", () => {
    const { children, click, document } = createFakeDocument();

    installDocumentScrollGuard(document);
    click("https://example.com/detail");
    expect(children).toHaveLength(1);

    vi.advanceTimersByTime(5000);
    expect(children).toHaveLength(0);
  });
});
