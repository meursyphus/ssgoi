import { describe, expect, it } from "vitest";
import { insertBeside } from "./insert-beside";

/** A column of siblings whose boxes follow a structural spacing rule. */
class Node {
  parent: Column | null = null;
  attrs = new Map<string, string>();
  constructor(public name: string) {}
  hasAttribute(name: string) {
    return this.attrs.has(name);
  }
  getAttribute(name: string) {
    return this.attrs.get(name) ?? null;
  }
  get parentElement() {
    return this.parent;
  }
  private sibling(offset: number): Node | null {
    const siblings = this.parent!.children;
    return siblings[siblings.indexOf(this) + offset] ?? null;
  }
  get previousElementSibling() {
    return this.sibling(-1);
  }
  get nextElementSibling() {
    return this.sibling(1);
  }
  before(node: Node) {
    node.detach();
    this.parent!.insert(node, this.parent!.children.indexOf(this));
  }
  after(node: Node) {
    node.detach();
    this.parent!.insert(node, this.parent!.children.indexOf(this) + 1);
  }
  detach() {
    if (this.parent)
      this.parent.children.splice(this.parent.children.indexOf(this), 1);
    this.parent = null;
  }
  getBoundingClientRect() {
    return this.parent!.boxOf(this);
  }
}

class Column {
  children: Node[] = [];
  constructor(
    /** [top, bottom] margins a sibling gets from its structural position. */
    private margins: (index: number, count: number) => [number, number],
    nodes: Node[],
  ) {
    for (const node of nodes) this.insert(node, this.children.length);
  }
  get parentElement() {
    return null;
  }
  get firstElementChild() {
    return this.children[0] ?? null;
  }
  get lastElementChild() {
    return this.children[this.children.length - 1] ?? null;
  }
  insert(node: Node, index: number) {
    this.children.splice(index, 0, node);
    node.parent = this;
  }
  /** Copies take no space, but selectors still count them as siblings. */
  private layout() {
    const boxes = new Map<Node, { top: number }>();
    let y = 0;
    const count = this.children.length;
    for (const [index, child] of this.children.entries()) {
      if (child.hasAttribute("inert")) {
        boxes.set(child, { top: y });
        continue;
      }
      const [top, bottom] = this.margins(index, count);
      boxes.set(child, { top: y + top });
      y += top + 10 + bottom;
    }
    return { boxes, height: y };
  }
  boxOf(node: Node) {
    return {
      left: 0,
      top: this.layout().boxes.get(node)!.top,
      width: 100,
      height: 10,
    };
  }
  getBoundingClientRect() {
    return { left: 0, top: 0, width: 100, height: this.layout().height };
  }
}

function copy() {
  const node = new Node("copy");
  node.attrs.set("inert", "");
  node.attrs.set("aria-hidden", "true");
  return node;
}

const place = (
  anchor: Node,
  node: Node,
  prefer: "below" | "above" = "below",
) => {
  const below = [
    "below",
    (n: Element) => anchor.before(n as unknown as Node),
  ] as const;
  const above = [
    "above",
    (n: Element) => anchor.after(n as unknown as Node),
  ] as const;
  return insertBeside(
    anchor as unknown as Element,
    node as unknown as Element,
    prefer === "below" ? [below, above] : [above, below],
  );
};

describe("insertBeside", () => {
  it("keeps the first side when nothing moves", () => {
    const image = new Node("image");
    const column = new Column(
      () => [0, 0],
      [new Node("a"), image, new Node("b")],
    );
    expect(place(image, copy())).toBe("below");
    expect(column.children.map((c) => c.name)).toEqual([
      "a",
      "copy",
      "image",
      "b",
    ]);
  });

  it("moves past a side that shifts the anchor (`* + *` spacing)", () => {
    const image = new Node("image");
    // Tailwind v3 space-y: every child after another gets a top margin.
    const column = new Column(
      (index) => [index > 0 ? 24 : 0, 0],
      [image, new Node("b")],
    );
    expect(place(image, copy())).toBe("above");
    expect(column.children.map((c) => c.name)).toEqual(["image", "copy", "b"]);
  });

  it("moves past a side that grows the parent (`:not(:last-child)` spacing)", () => {
    const image = new Node("image");
    // Tailwind v4 space-y: every child but the last gets a bottom margin.
    const column = new Column(
      (index, count) => [0, index < count - 1 ? 24 : 0],
      [new Node("a"), image],
    );
    expect(place(image, copy(), "above")).toBe("below");
    expect(column.children.at(-1)).toBe(image);
  });

  it("keeps the least disruptive side when every side moves something", () => {
    const image = new Node("image");
    // `:nth-child(3)` and `:nth-child(4)` top margins of 4px and 12px.
    const column = new Column(
      (index) => [index === 2 ? 4 : index === 3 ? 12 : 0, 0],
      [new Node("a"), image, new Node("b")],
    );
    const node = copy();
    // Below moves the image 4px and "b" 12px; above moves only "b", 8px.
    expect(place(image, node)).toBe("above");
    expect(column.children.indexOf(node)).toBe(2);
  });

  it("does not watch an earlier copy as the anchor's neighbour", () => {
    const image = new Node("image");
    const column = new Column(() => [0, 0], [new Node("a"), copy(), image]);
    expect(place(image, copy())).toBe("below");
    expect(column.children.map((c) => c.name)).toEqual([
      "a",
      "copy",
      "copy",
      "image",
    ]);
  });
});
