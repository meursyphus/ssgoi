import Image from "next/image";
import type { ComponentType, ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import {
  AngularMark,
  NextMark,
  NuxtMark,
  QwikMark,
  ReactRouterMark,
  SolidStartMark,
  SvelteKitMark,
  TanStackRouterMark,
} from "@/components/router-logos";
import { Link } from "@/lib/link";
import { FRAMEWORK_DOCS } from "@/page/docs/frameworks-data";
import {
  caption,
  DocsTable,
  Figure,
  inlineCode,
  link,
  measure,
  NextLinks,
  Note,
  prose,
  Section,
  Step,
  Steps,
} from "@/page/docs/ui";

const body = `${measure} ${prose}`;

/* -------------------------------------------------------------------------- */
/* Why SSGOI                                                                  */
/* -------------------------------------------------------------------------- */

export function WhySsgoiBody() {
  return (
    <div className="mt-8">
      <p className={body}>
        SSGOI animates the page that leaves against the page that arrives. It
        does not route: your router keeps URLs, data loading, history and SSR,
        and SSGOI only watches the routed element unmount and mount. Adding it
        means two new files, plus one edit to the layout you already have — so
        you can try it on an existing app and take it out again just as fast.
      </p>
      <p className={`mt-4 ${body}`}>
        Motion is simulated, not hand-tuned. A spring is integrated up front,
        compiled into keyframes and handed to the browser&apos;s Web Animations
        API, so no JavaScript runs per frame to move the page and the result is
        the same in Chrome, Safari, Firefox and Edge.
      </p>
      <p className={`mt-4 ${body}`}>
        Because it animates live DOM rather than snapshots, a preset can measure
        geometry, insert its own layers and keep a video playing — which is what
        makes Drill, Sheet, Slide and Zoom read as hierarchy, a temporary task,
        an ordered set and a card opening into its page, instead of decoration.
      </p>

      <Section
        title="A small surface area"
        lead="One provider, one boundary component, one layout edit."
      >
        <CodeBlock
          className="mt-6"
          language="text"
          code={`app/
  ssgoi-provider.tsx         # new — config + <Ssgoi>
  ssgoi-route-boundary.tsx   # new — pathname → key + transition id
  layout.tsx                 # already yours — wrap routed content`}
        />
        <p className={`mt-4 ${body}`}>
          Start with the pathname as both the boundary key and the route id.
          Only apps with persistent UI, such as a bottom nav, need to split
          those two later.{" "}
          <Link href="/docs/install" className={link}>
            Copy the quick start
          </Link>
          .
        </p>
      </Section>

      <Section
        title="The rule carries more than the effect"
        lead="A route rule says which navigations it covers, and SSGOI derives direction and scroll behaviour from that."
      >
        <p className={`mt-4 ${body}`}>
          <code className={inlineCode}>on</code> with{" "}
          <code className={inlineCode}>except</code> covers a whole family, such
          as a list and everything under it.{" "}
          <code className={inlineCode}>from</code>/
          <code className={inlineCode}>to</code> names one precise pair.{" "}
          <code className={inlineCode}>ordered</code> gives tabs or steps an
          index so direction follows position. The winning rule also decides
          whether the arriving page resets its scroll or comes back where you
          left it.
        </p>
        <p className={`mt-4 ${body}`}>
          Mobile and desktop can get different rule sets from{" "}
          <code className={inlineCode}>{"transitions({ isMobile })"}</code>.{" "}
          <Link href="/docs/route-rules" className={link}>
            Route rules
          </Link>{" "}
          has the matching details.
        </p>
      </Section>

      <Section
        title="Complexity stays opt-in"
        lead="One boundary is enough until part of the routed UI has to survive a navigation."
      >
        <p className={`mt-4 ${body}`}>
          When a bottom nav should stay put across tab changes but leave on a
          detail route, keep the nav outside an inner content boundary. That
          still uses one provider and one config —{" "}
          <Link href="/docs/nested-boundaries" className={link}>
            persistent layouts
          </Link>{" "}
          shows the shape.
        </p>
      </Section>

      <NextLinks
        links={[
          {
            href: "/docs/transitions",
            title: "Transitions",
            body: "Pick the effect from the navigation you are building.",
          },
          {
            href: "/docs/frameworks",
            title: "Frameworks",
            body: "The config is shared; the wiring around it differs per stack.",
          },
          {
            href: "/docs/compatibility",
            title: "Browser & router support",
            body: "Which browsers and routers are covered.",
          },
          {
            href: "/docs/view-transition-api",
            title: "Why not View Transitions",
            body: "Where the browser API ends and the presets begin.",
          },
        ]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Why not View Transitions                                                   */
/* -------------------------------------------------------------------------- */

const VT_EXAMPLES = [
  {
    name: "Zoom",
    body: "The whole detail page unfolds from its image.",
    src: "/blog/view-transition-api-limitations/zoom-blur.gif",
    width: 360,
    height: 696,
  },
  {
    name: "Film",
    body: "A runtime scene with live video and several springs.",
    src: "/blog/view-transition-api-limitations/film.gif",
    width: 640,
    height: 360,
  },
  {
    name: "Sheet",
    body: "A live backdrop sits between the two pages.",
    src: "/blog/view-transition-api-limitations/sheet-blur-full.gif",
    width: 360,
    height: 696,
  },
];

const VT_ROWS: string[][] = [
  [
    "What is animated",
    "Old and new snapshots in a generated pseudo-element tree.",
    "The real leaving and arriving DOM, plus layers a preset creates.",
  ],
  [
    "Animation control",
    "CSS or Web Animations on the generated pseudo-elements.",
    "Web Animations on live elements, driven by spring timelines.",
  ],
  [
    "Route meaning",
    "The browser starts a transition; your code still decides what the navigation means.",
    "on/except, from/to and ordered pick the preset and resolve direction.",
  ],
  [
    "Interruption",
    "The running transition can be skipped; your code owns what replaces it.",
    "A new navigation force-completes the previous run, removes the page it had reinserted, and starts the next one.",
  ],
  [
    "Layout ownership",
    "Independent of framework mount and persistent-layout lifetime.",
    "Boundaries state which routed region may leave, enter or stay mounted.",
  ],
  [
    "Reuse",
    "Each app measures geometry and names its own snapshot groups.",
    "A preset owns the measuring, scene setup, pairing and cleanup once.",
  ],
];

export function ViewTransitionApiBody() {
  return (
    <div className="mt-8">
      <p className={body}>
        Same-document{" "}
        <code className={inlineCode}>document.startViewTransition()</code> is
        available across current browsers, so this is not a support argument.
        SSGOI picks a different control model: it animates the live pages
        instead of snapshots of them.{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition"
          target="_blank"
          rel="noreferrer"
          className={link}
        >
          Current platform support
        </a>
      </p>

      <Section
        title="What a preset packages"
        lead="Each of these needs geometry, temporary layers and the leaving page's real DOM — the parts an app would otherwise rebuild per effect."
      >
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {VT_EXAMPLES.map((example) => (
            <figure key={example.name}>
              <div className="flex h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-panel p-4">
                <Image
                  src={example.src}
                  alt={`${example.name} transition: ${example.body}`}
                  width={example.width}
                  height={example.height}
                  unoptimized
                  className="max-h-full w-auto max-w-full rounded-xl object-contain"
                />
              </div>
              <figcaption className={`mt-3 ${caption}`}>
                <span className="font-medium text-ink">{example.name}</span> —{" "}
                {example.body}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section
        title="Snapshot tree, or live scene"
        lead="Both can use the Web Animations API. What differs is the material the animation runs on."
      >
        <CodeBlock
          className="mt-6"
          language="text"
          code={`View Transition API
::view-transition
└─ group
   └─ image-pair
      ├─ old snapshot
      └─ new snapshot

SSGOI
route boundary unmounts OUT ─┐
route boundary mounts IN ────┼─ preset measures + animates live DOM
temporary backdrop / pieces ─┘`}
        />

        <DocsTable
          head={["Concern", "View Transition API", "SSGOI"]}
          rows={VT_ROWS}
          minWidth="680px"
        />

        <div className="mt-8">
          <Note>
            None of this makes the native API a cross-fade. You can build shared
            elements and elaborate choreography with it — you just keep owning
            the geometry, the intermediate scene pieces, the routing policy and
            the cleanup.
          </Note>
        </div>
      </Section>

      <Section
        title="Choose by ownership"
        lead="Use the native API when your app wants to name its own snapshot groups. Use SSGOI when the same interaction should be reusable across routes, routers and frameworks."
      >
        <p className={`mt-4 ${body}`}>
          The full engineering account — geometry, live video, temporary DOM,
          blur layers and interruption — is in{" "}
          <a
            href="https://ssgoi.dev/blog/view-transition-api-limitations"
            className={link}
          >
            Why I didn&apos;t use the View Transition API
          </a>
          .
        </p>
      </Section>

      <NextLinks
        links={[
          {
            href: "/docs/why-ssgoi",
            title: "Why SSGOI",
            body: "What it is for, and what it leaves alone.",
          },
          {
            href: "/docs/how-it-works",
            title: "How it works",
            body: "Follow the leaving page from unmount to cleanup.",
          },
        ]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Route boundaries                                                           */
/* -------------------------------------------------------------------------- */

export function BoundariesBody() {
  return (
    <div className="mt-8">
      <p className={body}>
        This is the component that marks a routed page. The{" "}
        <Link href="/docs/install" className={link}>
          quick start
        </Link>{" "}
        creates it in step 2; here is what each of its two values decides. For
        most apps both are just the pathname.
      </p>

      <CodeBlock
        className="mt-6"
        code={`"use client";

import { usePathname } from "next/navigation";

export function SsgoiRouteBoundary({ children }) {
  const pathname = usePathname();

  return (
    <div key={pathname} data-ssgoi-transition={pathname}>
      {children}
    </div>
  );
}`}
      />

      <p className={`mt-6 ${body}`}>
        React needs a wrapper component because the router does not own the
        routed element. The SvelteKit, Nuxt and SolidStart templates use the
        same wrapper shape; in Qwik and Angular you put the key and the
        attribute on the routed page root itself —{" "}
        <Link href="/docs/frameworks" className={link}>
          Frameworks
        </Link>{" "}
        has the version for your stack.
      </p>

      <Section
        title="What each value decides"
        lead="They start out identical, but they answer different questions and are read by different things."
      >
        <DocsTable
          head={["Value", "What it decides", "Who reads it"]}
          rows={[
            [
              <code key="k" className={inlineCode}>
                key
              </code>,
              "Whether this DOM node survives the navigation. SSGOI reacts to the framework destroying and rebuilding the routed node.",
              "Your framework",
            ],
            [
              <code key="i" className={inlineCode}>
                data-ssgoi-transition
              </code>,
              "Which logical route the node represents, so the leaving page can be paired with the arriving one and matched against your rules.",
              "SSGOI config",
            ],
          ]}
          minWidth="620px"
        />

        <div className="mt-8">
          <Note>
            Changing only the id on a node that stays mounted animates nothing.
            The key has to change too — the id labels the transition, the
            remount triggers it.
          </Note>
        </div>
      </Section>

      <Section
        title="When they stop being the same"
        lead="A persistent layout gives several routes one shared mount while their route ids keep changing."
      >
        <p className={`mt-4 ${body}`}>
          A bottom-nav app is the usual case. Tab → tab should remount only the
          page content; tab → detail should remount the whole shell and take the
          nav with it. That needs an outer shell boundary and an inner content
          boundary.
        </p>
        <p className={`mt-4 ${body}`}>
          When both change in the same navigation, the outer one owns the
          transition. The outer node is the one the framework removes, so the
          inner boundary is torn down inside it — there is no separate node left
          for it to animate.
        </p>

        <div className="mt-6">
          <Note>
            Keep one <code className={inlineCode}>&lt;Ssgoi&gt;</code> provider.
            Add boundaries to express ownership; never nest providers.
          </Note>
        </div>
      </Section>

      <NextLinks
        links={[
          {
            href: "/docs/nested-boundaries",
            title: "Persistent layouts",
            body: "Outer shell, inner content, route groups, intercepting modals.",
          },
          {
            href: "/docs/route-rules",
            title: "Route rules",
            body: "Match the ids you just set with on, from/to or ordered.",
          },
          {
            href: "/docs/how-it-works",
            title: "How it works",
            body: "Read this when you need to debug unmount or cleanup.",
          },
        ]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Route rules                                                                */
/* -------------------------------------------------------------------------- */

export function RouteRulesBody() {
  return (
    <div className="mt-8">
      <p className={body}>
        <code className={inlineCode}>drill()</code>,{" "}
        <code className={inlineCode}>slide()</code> and the rest describe
        motion. The rule around one decides which navigations it covers, which
        way is forward, and what happens to scroll. Pick the relationship first.
      </p>

      <DocsTable
        head={["Rule", "Use it for", "Example"]}
        rows={[
          [
            <code key="on" className={inlineCode}>
              on + except
            </code>,
            "A route family or a drill-down scope.",
            "/posts ↔ /posts/42",
          ],
          [
            <code key="ft" className={inlineCode}>
              from / to
            </code>,
            "One precise relationship between two screens.",
            "/gallery ↔ /photo/42",
          ],
          [
            <code key="or" className={inlineCode}>
              ordered
            </code>,
            "Tabs or steps whose position decides direction.",
            "feed → search → profile",
          ],
        ]}
        minWidth="560px"
      />

      <p className={`mt-6 ${body}`}>
        <code className={inlineCode}>on</code>,{" "}
        <code className={inlineCode}>except</code>,{" "}
        <code className={inlineCode}>from</code> and{" "}
        <code className={inlineCode}>to</code> each take one pattern or an array
        of patterns, and the best-matching entry in the array is the one that
        scores. <code className={inlineCode}>ordered</code> is the exception:
        one pattern per slot, no arrays inside it.
      </p>

      <Section
        title="The three forms"
        lead="The way you write the relationship is the forward direction."
      >
        <CodeBlock
          className="mt-6"
          code={`const config = {
  transitions: [
    // Entering the family is forward, leaving it is backward.
    {
      on: "/posts/**",
      except: "/posts",
      transition: drill(),
    },

    // The written pair is forward. The reverse also matches.
    {
      from: "/gallery",
      to: "/photo/*",
      transition: zoom(),
    },

    // A rising index is forward.
    {
      ordered: ["/tabs/feed", "/tabs/search", "/tabs/profile"],
      transition: slide(),
    },
  ],
};`}
        />
        <p className={`mt-6 ${body}`}>
          A <code className={inlineCode}>from</code>/
          <code className={inlineCode}>to</code> pair matches in both
          orientations. Set{" "}
          <code className={inlineCode}>bidirectional: false</code> when only the
          orientation you wrote should match at all — it does not mean &ldquo;
          match, but always play forward&rdquo;.
        </p>
        <p className={`mt-4 ${body}`}>
          In an <code className={inlineCode}>ordered</code> array both routes
          have to land on <em>different</em> entries; if they resolve to the
          same one, the rule does not match.
        </p>
        <p className={`mt-4 ${body}`}>
          When both routes are inside the same{" "}
          <code className={inlineCode}>on</code> scope, SSGOI cannot tell
          entering from leaving, so it falls back to its own history tracking: a
          destination it recognises as the route you came from — or any
          navigation that followed a{" "}
          <code className={inlineCode}>popstate</code> — counts as backward.
          That is SSGOI&apos;s route stack, not the browser&apos;s, so a
          &ldquo;back&rdquo; button implemented with{" "}
          <code className={inlineCode}>push()</code> still reads as backward.
        </p>
      </Section>

      <Section
        title="Path patterns"
        lead="Use exact paths until the relationship really is a family."
      >
        <DocsTable
          head={["Pattern", "Matches"]}
          rows={[
            [
              <code key="a" className={inlineCode}>
                /posts
              </code>,
              "Only /posts.",
            ],
            [
              <code key="b" className={inlineCode}>
                /posts/*
              </code>,
              "Exactly one more segment: /posts/42, but not /posts/42/edit.",
            ],
            [
              <code key="c" className={inlineCode}>
                /posts/:id
              </code>,
              "The same one segment as *, but ranked higher when two patterns compete. [id] and {id} work too; the name is never captured.",
            ],
            [
              <code key="d" className={inlineCode}>
                /posts/**
              </code>,
              "/posts itself plus any number of segments under it. ** only works as the last segment — a pattern like /a/**/b matches nothing.",
            ],
            [
              <code key="e" className={inlineCode}>
                {"/**"}
              </code>,
              "Every path. A bare * is an alias for it.",
            ],
          ]}
          minWidth="560px"
        />
        <div className="mt-8">
          <Note>
            Query strings, hashes and trailing slashes are stripped before
            matching, so no rule can tell{" "}
            <code className={inlineCode}>/search?q=a</code> apart from{" "}
            <code className={inlineCode}>/search</code>. Partial-segment globs
            such as <code className={inlineCode}>/posts/p*</code> are not
            supported.
          </Note>
        </div>
      </Section>

      <Section
        title="When two rules match"
        lead="Higher priority wins, then the more specific path, then the rule you declared first."
      >
        <p className={`mt-4 ${body}`}>
          A rule with no <code className={inlineCode}>priority</code> is 0, so a
          negative value parks a broad fallback below everything else.
        </p>
        <CodeBlock
          className="mt-6"
          language="ts"
          code={`transitions: [
  { priority: -100, on: "/**", transition: fade() },
  { on: "/posts/**", except: "/posts", transition: drill() },
]`}
        />
        <p className={`mt-6 ${body}`}>
          Note the last step: the <em>earliest</em> rule wins a tie, so a later
          duplicate never overrides an earlier one.
        </p>
        <p className={`mt-4 ${body}`}>
          Specificity is also not one shared scale. Each side of a rule scores
          its matched path — 100 per literal segment,{" "}
          <code className={inlineCode}>:id</code> 10,{" "}
          <code className={inlineCode}>*</code> 1,{" "}
          <code className={inlineCode}>**</code> 0, and a whole-path exact match
          jumps above all of them. An <code className={inlineCode}>on</code>{" "}
          rule then takes the <em>higher</em> of its two endpoints, while{" "}
          <code className={inlineCode}>from</code>/
          <code className={inlineCode}>to</code> and{" "}
          <code className={inlineCode}>ordered</code> take the <em>sum</em>. A
          pair rule wins whenever its two sides add up past the{" "}
          <code className={inlineCode}>on</code> rule&apos;s single best side.
          If the outcome matters, set{" "}
          <code className={inlineCode}>priority</code> rather than reasoning
          about the score.
        </p>
        <p className={`mt-4 ${body}`}>
          If nothing matches, nothing animates — and the navigation is not
          side-effect free. The arriving page is reset to the top, and the page
          you left has its recorded scroll position discarded, so an unmatched
          navigation also costs you the restore on the way back. Keep broad
          fallbacks at a low priority so they fill that gap.
        </p>
      </Section>

      <NextLinks
        links={[
          {
            href: "/docs/transitions",
            title: "Transitions",
            body: "Pick a preset once the relationship is clear.",
          },
          {
            href: "/docs/scroll-restoration",
            title: "Scroll behavior",
            body: "See what scroll default the winning rule brings with it.",
          },
          {
            href: "/docs/middleware",
            title: "Middleware",
            body: "Strip locale, tenant or rewrite noise before rules match.",
          },
        ]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Scroll behavior                                                            */
/* -------------------------------------------------------------------------- */

export function ScrollRestorationBody() {
  return (
    <div className="mt-8">
      <p className={body}>
        SSGOI records where each route was scrolled to and decides, per
        navigation, whether the arriving page starts at the top or comes back
        where you left it. The rule that matched supplies that decision, so most
        apps configure nothing here.
      </p>

      <Figure
        src="/docs/diagrams/scroll-restore.png"
        alt="Forward navigation records the list scroll position and resets the detail page; back navigation restores the list position."
        width={1672}
        height={941}
        caption="Scroll belongs to the matched route relationship, not to the visual preset."
      />

      <Section
        title="The automatic policy"
        lead="from and to name the rule's forward relationship, not the current navigation. Going backward swaps which page is physically leaving and arriving."
      >
        <DocsTable
          head={["Rule", "Forward from", "Forward to"]}
          rows={[
            [
              <code key="a" className={inlineCode}>
                on
              </code>,
              "restore",
              "reset",
            ],
            [
              <code key="b" className={inlineCode}>
                from / to
              </code>,
              "restore",
              "reset",
            ],
            [
              <code key="c" className={inlineCode}>
                ordered
              </code>,
              "restore",
              "restore",
            ],
          ]}
          minWidth="480px"
        />
        <p className={`mt-6 ${body}`}>
          Reset and restore only ever run on the page that is arriving. The
          leaving page keeps animating at the scroll position it already had.
        </p>
        <p className={`mt-4 ${body}`}>
          When both routes are already inside the same{" "}
          <code className={inlineCode}>on</code> scope, both count as the{" "}
          <code className={inlineCode}>to</code> side and both reset. For stack
          UX, use <code className={inlineCode}>except</code> to keep the source
          route outside the scope.
        </p>
      </Section>

      <Section
        title="Override one relationship"
        lead="Reach for preserveScroll only when the automatic behaviour is wrong for that rule. Both keys are required."
      >
        <CodeBlock
          className="mt-6"
          language="ts"
          code={`{
  from: "/gallery",
  to: "/photo/*",
  preserveScroll: { from: true, to: true },
  transition: zoom(),
}`}
        />
      </Section>

      <Section
        title="Mobile and desktop"
        lead="There is no separate mobile scroll switch. Serve different rule sets and each winning rule brings its own default or override."
      >
        <CodeBlock
          className="mt-6"
          language="ts"
          code={`transitions: ({ isMobile }) =>
  isMobile
    ? [
        {
          on: "/posts/**",
          except: "/posts",
          transition: drill(),
        },
      ]
    : [
        {
          from: "/posts",
          to: "/posts/*",
          preserveScroll: { from: true, to: false },
          transition: fade(),
        },
      ]`}
        />
      </Section>

      <Section
        title="Two things worth knowing"
        lead="Both of these read as a scroll bug long before anyone suspects the engine."
      >
        <div className="mt-6">
          <Note>
            Only the vertical offset is compensated while the leaving page
            animates. A horizontally scrolled page is re-inserted at{" "}
            <code className={inlineCode}>left: 0</code>, so it will appear to
            jump sideways.
          </Note>
        </div>
        <div className="mt-6">
          <Note>
            <code className={inlineCode}>scroll()</code> is a visual page
            transition. Scroll restoration is navigation state. The two features
            have nothing to do with each other.
          </Note>
        </div>
      </Section>

      <NextLinks
        links={[
          {
            href: "/docs/route-rules",
            title: "Route rules",
            body: "The semantic from and to sides this policy reads.",
          },
          {
            href: "/docs/middleware",
            title: "Middleware",
            body: "Normalized route ids double as scroll identities.",
          },
        ]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Middleware                                                                 */
/* -------------------------------------------------------------------------- */

export function MiddlewareBody() {
  return (
    <div className="mt-8">
      <p className={body}>
        Add middleware when the URL carries structure your transition rules
        should ignore — a locale, a tenant prefix, a rewrite. It rewrites the
        route ids once, before anything else sees them.
      </p>

      <Section
        title="Normalize before matching"
        lead="Middleware takes the raw from and to ids and returns the logical ids every rule works with."
      >
        <CodeBlock
          className="mt-6"
          language="text"
          code={`raw URL        /en/posts/42  →  /en/posts
                       │ middleware removes locale
logical route     /posts/42     →  /posts
                       │
                       └─ one shared rule set`}
        />
        <CodeBlock
          className="mt-6"
          language="ts"
          code={`const config = {
  middleware: (from, to) => ({
    from: from.replace(/^\\/(en|ko)(?=\\/|$)/, ""),
    to: to.replace(/^\\/(en|ko)(?=\\/|$)/, ""),
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
      </Section>

      <Section
        title="One identity all the way through"
        lead="The resolved id is what rules match and what scroll positions are filed under."
      >
        <p className={`mt-4 ${body}`}>
          Above, <code className={inlineCode}>/en/posts</code> and{" "}
          <code className={inlineCode}>/ko/posts</code> both become{" "}
          <code className={inlineCode}>/posts</code>. They match the same rules
          and share one restored scroll position. If the two locales must keep
          separate state, do not collapse them onto the same id.
        </p>
        <div className="mt-6">
          <Note>
            For scroll bookkeeping the middleware is called with the same path
            on both sides, and only its <code className={inlineCode}>from</code>{" "}
            result is used. Write it as a plain per-path rewrite: one that
            branches on <code className={inlineCode}>from !== to</code>, or
            rewrites the two sides differently, will file scroll under an id you
            did not expect.
          </Note>
        </div>
      </Section>

      <Section
        title="What not to use it for"
        lead="Middleware removes incidental URL structure. It should not hide a complicated transition model."
      >
        <ul
          className={`mt-5 ${measure} flex list-disc flex-col gap-2 pl-5 ${prose}`}
        >
          <li>
            Device branching — use{" "}
            <code className={inlineCode}>{"transitions({ isMobile })"}</code>.
          </li>
          <li>Persistent layout lifetime — use boundaries and scoped keys.</li>
          <li>
            Effect variants — pass props to{" "}
            <code className={inlineCode}>drill()</code>,{" "}
            <code className={inlineCode}>sheet()</code> and the rest.
          </li>
        </ul>
      </Section>

      <NextLinks
        links={[
          {
            href: "/docs/route-rules",
            title: "Route rules",
            body: "Match the normalized ids with on, from/to or ordered.",
          },
          {
            href: "/docs/scroll-restoration",
            title: "Scroll behavior",
            body: "The state that follows the resolved id.",
          },
        ]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Troubleshooting                                                            */
/* -------------------------------------------------------------------------- */

const TROUBLE_CHECKS: Array<{ title: string; items: ReactNode[] }> = [
  {
    title: "Nothing animates",
    items: [
      "Both routes render under the same single <Ssgoi> provider.",
      "The leaving and arriving route roots both carry data-ssgoi-transition.",
      "The boundary key changes when that routed region changes. Changing only the id on a node that stays mounted does nothing.",
      "One route rule matches the pair. If none does, nothing animates: the arriving page resets to the top, and the page you left loses its saved scroll position.",
      "An edge swipe from either screen edge (iOS swipe-back, Android system back gesture) is detected as a native gesture, and the transition is skipped on purpose.",
    ],
  },
  {
    title: "The wrong region animates",
    items: [
      "Find the nearest boundary whose key changed.",
      "Keep persistent UI outside the inner boundary that remounts.",
      "Reuse an outer key only while the routes really share that shell.",
      "Do not create a nested <Ssgoi> provider.",
      "When a parent and a child boundary both change in one navigation, the outer one owns the transition.",
    ],
  },
  {
    title: "The page jumps or flickers",
    items: [
      "Give the element around <Ssgoi> a positioned containing block — the leaving page is re-inserted position: absolute and anchors to it.",
      "Clip horizontal overflow for transitions that travel past the viewport.",
      "Give routed pages a full-height background when the design needs one.",
    ],
  },
  {
    title: "Scroll is unexpected",
    items: [
      "Identify the rule that won; the scroll policy belongs to that relationship.",
      "Check middleware if the visible URL and the logical route id differ.",
      "Remove preserveScroll and confirm the automatic default first.",
      "Define the config object outside render, or memoize it. A new object on every render rebuilds the context and drops every recorded scroll position.",
    ],
  },
];

export function TroubleshootingBody() {
  return (
    <div className="mt-8">
      <Note>
        Work from the outside in: provider, markers, boundary key, winning rule,
        then layout. Engine internals are the last stop, not the first.
      </Note>

      <Steps>
        {TROUBLE_CHECKS.map((check, index) => (
          <Step key={check.title} n={index + 1} title={check.title}>
            <ul
              className={`${measure} flex list-disc flex-col gap-2 pl-5 ${prose}`}
            >
              {check.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Step>
        ))}
      </Steps>

      <Section
        title="Layout sanity check"
        lead="This is the minimum shell the leaving page expects while SSGOI has it re-inserted."
      >
        <CodeBlock
          className="mt-6"
          code={`<main className="relative z-0 min-h-dvh overflow-x-clip">
  <Ssgoi config={config}>{children}</Ssgoi>
</main>`}
        />
        <div className="mt-6">
          <Note>
            Use <code className={inlineCode}>overflow-x: clip</code>, not{" "}
            <code className={inlineCode}>hidden</code>. Hiding one axis makes
            the other computed <code className={inlineCode}>auto</code>, which
            turns the wrapper itself into the scroll container — and SSGOI then
            records scroll against the wrong element.
          </Note>
        </div>
      </Section>

      <NextLinks
        title="If the checklist did not cover it"
        links={[
          {
            href: "/docs/frameworks",
            title: "Frameworks",
            body: "Check the routed DOM lifecycle for your stack.",
          },
          {
            href: "/docs/boundaries",
            title: "Route boundaries",
            body: "Separate the key that remounts from the id that matches.",
          },
          {
            href: "/docs/layout",
            title: "Layout shell",
            body: "Containing blocks and horizontal clipping.",
          },
          {
            href: "/docs/how-it-works",
            title: "How it works",
            body: "Unmount, re-insertion, animation, cleanup.",
          },
        ]}
      />

      <p className={`mt-8 ${caption}`}>
        Agent-oriented checklist:{" "}
        <a
          href="https://ssgoi.dev/llms/troubleshooting.txt"
          target="_blank"
          rel="noreferrer"
          className={link}
        >
          /llms/troubleshooting.txt
        </a>
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Frameworks                                                                 */
/* -------------------------------------------------------------------------- */

const FRAMEWORK_MARKS: Record<string, ComponentType<{ className?: string }>> = {
  nextjs: NextMark,
  "react-router": ReactRouterMark,
  "tanstack-router": TanStackRouterMark,
  sveltekit: SvelteKitMark,
  nuxt: NuxtMark,
  solidstart: SolidStartMark,
  qwik: QwikMark,
  angular: AngularMark,
};

export function FrameworksIndexBody() {
  return (
    <div className="mt-8">
      <p className={body}>
        Pick the guide for the framework that owns your routed DOM. Transition
        factories and route rules are identical everywhere; the provider and
        boundary wiring differ per stack — Qwik takes a QRL config factory,
        Angular an <code className={inlineCode}>ssgoi</code> directive.
      </p>

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {FRAMEWORK_DOCS.map((doc) => {
          const href = `/docs/frameworks/${doc.slug}`;
          const Mark = FRAMEWORK_MARKS[doc.slug];

          return (
            <li key={doc.slug} className="py-5">
              <div className="flex gap-4">
                {Mark && (
                  <span className="mt-0.5 shrink-0" aria-hidden>
                    <Mark className="h-6 w-6" />
                  </span>
                )}
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-ink">
                    <Link href={href} className="hover:underline">
                      {doc.name}
                    </Link>
                    <span className="ml-2 font-normal text-ink-faint">
                      {doc.pkg}
                    </span>
                  </h2>
                  <p className={`mt-1.5 ${measure} ${prose}`}>{doc.lead}</p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem]">
                    <Link href={href} className={link}>
                      Guide
                    </Link>
                    {doc.llmsUrl && (
                      <a
                        href={doc.llmsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={link}
                      >
                        Agent guide
                      </a>
                    )}
                    {doc.templateUrl && (
                      <a
                        href={doc.templateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={link}
                      >
                        Template
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <Section
        title="What every stack shares"
        lead="Once the boundary is wired, the mental model is the same everywhere."
      >
        <ul
          className={`mt-5 ${measure} flex list-disc flex-col gap-2 pl-5 ${prose}`}
        >
          <li>Route rules choose the navigation relationship.</li>
          <li>Transition factories choose the motion and its variants.</li>
          <li>Boundaries choose the routed region that owns the motion.</li>
        </ul>
      </Section>

      <NextLinks
        links={[
          {
            href: "/docs/route-rules",
            title: "Route rules",
            body: "on/except, from/to and ordered, once the provider is wired.",
          },
          {
            href: "/docs/boundaries",
            title: "Route boundaries",
            body: "The key and the route id, before you add persistent layouts.",
          },
        ]}
      />
    </div>
  );
}
