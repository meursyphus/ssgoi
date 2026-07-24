# @ssgoi/core

Framework-agnostic route transition engine for SSGOI.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

Most applications should install a framework package:

```bash
npm install @ssgoi/react
# or @ssgoi/svelte, @ssgoi/vue, @ssgoi/solid, @ssgoi/qwik
```

Agent setup guide: https://ssgoi.dev/llms.txt

## Configuration

`SsgoiConfig` contains route matching and effects. Layout lifetime belongs to
framework-specific transition boundaries, not this config.

```ts
import { drill, slide, zoom, type SsgoiConfig } from "@ssgoi/core";

const config: SsgoiConfig = {
  preserveScroll: { exclude: ["/posts/*"] },
  transitions: [
    { on: "/posts/**", except: "/posts", transition: drill() },
    { from: "/gallery", to: "/gallery/*", transition: zoom() },
    {
      ordered: ["/tabs/a", "/tabs/b", "/tabs/c"],
      transition: slide(),
    },
  ],
};
```

Rule forms:

- `on`: route family. Entering is forward; leaving is backward.
- `from`/`to`: precise pair. Reverse matching is enabled by default.
- `ordered`: array order decides forward and backward.
- `priority`: higher values win before path specificity.

Path patterns:

- `/posts`: exact.
- `/posts/*`: exactly one arbitrary segment.
- `/posts/**`: the parent and every descendant.

A bare `*` remains a compatibility alias for `/**`. Named single-segment forms
remain supported and rank above a single-segment `*` when rules overlap, but
their names are not captured or exposed.

## Boundary model

A framework adapter observes elements marked with:

```html
<div data-ssgoi-transition="/posts/1">...</div>
```

The framework decides when that element is replaced. Nested boundaries follow
DOM lifetime:

- Parent and child change together: the outer changed boundary owns the event.
- Parent remains mounted: the changed child owns the event.

This supports persistent layouts, inner tab transitions, and bottom navigation
with one SSGOI instance.

## Transition context

Custom effects receive semantic direction through `context`:

```ts
import { defineTransition } from "@ssgoi/core";

const effect = defineTransition({
  prepare: ({ from, to, context }) => {
    // Pre-paint setup.
    return {};
  },
  animation: ({ from, to, context }) => {
    // context.direction is "forward" or "backward".
    return animation;
  },
});
```

## Effect index

- `fade`: unrelated pages.
- `drill`: list → detail hierarchy.
- `slide`: ordered tabs and steps.
- `axis`: sibling destinations.
- `sheet`: modal-like routes.
- `zoom`: card or image → detail.
- `hero`: shared elements plus page chrome.
- `scroll`: vertical sequences.
- `strip`, `film`, `rotate`, `blind`, `jaemin`: expressive transitions.

Effect references: https://ssgoi.dev/llms.txt#7-transition-index

## Layout requirements

The shell around the framework root should provide:

```css
.ssgoi-shell {
  position: relative;
  z-index: 0;
  overflow-x: clip;
}
```

`overflow-x: clip` is needed for horizontal effects.

## License

MIT
