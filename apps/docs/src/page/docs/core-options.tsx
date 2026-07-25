import { Link } from "@/lib/link";
import { CodeBlock } from "@/components/code-block";

export function CoreOptionsBody() {
  return (
    <div className="mt-8">
      <p className="max-w-xl leading-relaxed text-neutral-400">
        Scroll restoration lives on transition rules; middleware lives on the
        root config. This page explains both pieces and the small bridge between
        route matching and scroll bookkeeping.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight text-neutral-100">
        Scroll restoration
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        Why it exists: during a transition the leaving page is a detached DOM
        node that SSGOI re-inserts over the new one. The browser&apos;s own
        scroll restoration knows nothing about that — without help, the OUT page
        would render from its top edge mid-animation, and returning to a long
        list would land you back at the top.
      </p>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
        So SSGOI keeps a scroll map per route id. Leaving a page records its
        scroll offset; the re-inserted OUT node is shifted by that offset so it
        doesn&apos;t jump. The matched route relationship decides whether the
        next IN page restores a saved offset or starts at the top:
      </p>

      <CodeBlock
        className="mt-5"
        language="text"
        code={`navigate /posts → /posts/42            back → /posts

scroll map                             scroll map
  /posts: 1240px   ◀── record            /posts: 1240px ──▶ restore

OUT /posts is re-inserted with         /posts re-enters at 1240px,
top: -1240px — no visual jump          not at the top`}
      />

      <p className="mt-6 max-w-xl text-sm leading-relaxed text-neutral-400">
        The automatic policy follows the UX expressed by the rule. On an{" "}
        <code className="font-mono text-neutral-200">on</code> rule, the route
        outside the scope is semantic{" "}
        <code className="font-mono text-neutral-200">from</code> and restores,
        while a route matched by <code className="font-mono">on</code> is
        semantic <code className="font-mono">to</code> and resets. A navigation
        entirely inside that scope applies the{" "}
        <code className="font-mono">to</code> policy to both pages. A{" "}
        <code className="font-mono text-neutral-200">from</code>/
        <code className="font-mono text-neutral-200">to</code> pair follows the
        same restore/reset policy. An{" "}
        <code className="font-mono text-neutral-200">ordered</code> rule
        restores every listed path by default.
      </p>

      <p className="mt-6 max-w-xl text-sm leading-relaxed text-neutral-400">
        Override both semantic sides only when the automatic UX is not right:
      </p>
      <CodeBlock
        className="mt-4"
        language="ts"
        code={`const config = {
  transitions: [
    {
      on: "/posts/**",
      except: "/posts",
      transition: drill(),
    },
    {
      ordered: ["/tabs/feed", "/tabs/search", "/tabs/profile"],
      transition: slide(),
    },
    {
      from: "/gallery",
      to: "/photo/*",
      preserveScroll: { from: true, to: true },
      transition: zoom(),
    },
  ],
};`}
      />

      <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-400">
        These booleans describe the rule&apos;s forward relationship. On a
        backward navigation their physical OUT/IN mapping reverses
        automatically. The outgoing page always animates at its current scroll;
        reset or restoration runs only when a page becomes IN. This is also why
        the same route can reset under one matching transition and restore under
        another. Device-specific behavior stays in the existing functional{" "}
        <code className="font-mono">{"transitions({ isMobile })"}</code>{" "}
        resolver; there is no second mobile scroll default.
      </p>

      <h2 className="mt-14 text-xl font-semibold tracking-tight text-neutral-100">
        middleware
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
        Why it exists: transition rules match logical routes, but real URLs
        carry extra structure — locale prefixes, rewrites, tenant slugs. Without
        a hook you&apos;d duplicate every rule per variant.{" "}
        <code className="font-mono text-neutral-200">middleware</code> rewrites{" "}
        <code className="font-mono text-neutral-200">(from, to)</code> once,
        before any rule matching:
      </p>

      <CodeBlock
        className="mt-5"
        language="text"
        code={`raw URLs      /en/posts/42 ──▶ /en/posts
                      │ middleware strips the locale
logical       /posts/42    ──▶ /posts
                      │
              rules match logical paths — one rule set for every locale`}
      />

      <CodeBlock
        className="mt-5"
        language="ts"
        code={`const config = {
  middleware: (from, to) => ({
    from: from.replace(/^\\/(en|ko)/, ""),
    to: to.replace(/^\\/(en|ko)/, ""),
  }),
  transitions: [
    {
      on: "/posts/**",
      except: "/posts",
      transition: drill(),
    },
  ],
};`}
      />

      <p className="mt-6 max-w-xl text-sm leading-relaxed text-neutral-400">
        One detail worth knowing when debugging: the scroll map above is keyed
        by the <em>middleware-resolved</em> id too. Every scroll record and
        restore funnels through the same rewrite, so{" "}
        <code className="font-mono text-neutral-300">/en/posts</code> and{" "}
        <code className="font-mono text-neutral-300">/ko/posts</code> resolve to
        one identity and can&apos;t miss each other mid-transition.
      </p>

      <p className="mt-10 max-w-xl text-sm leading-relaxed text-neutral-500">
        The re-insertion mechanism these features lean on is covered in{" "}
        <Link
          href="/docs/how-it-works"
          className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400"
        >
          How it works
        </Link>
        .
      </p>
    </div>
  );
}
