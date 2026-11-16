import type { ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { Link } from "@/lib/link";
import {
  caption,
  DocsTable,
  Heading3,
  inlineCode,
  link,
  measure,
  NextLinks,
  Note,
  prose,
  Section,
} from "@/page/docs/ui";
import {
  FIND_USAGES,
  HERO_KEY_AFTER,
  HERO_KEY_BEFORE,
  MEDIA_HINTS_AFTER,
  MEDIA_HINTS_BEFORE,
  MOTION_AFTER,
  MOTION_BEFORE,
  PRESET_OPTIONS_AFTER,
  PRESET_OPTIONS_BEFORE,
  ROUTER_EXAMPLES,
  ROUTE_KEY_AFTER,
  ROUTE_KEY_BEFORE,
  SSGOI_TRANSITION_AFTER,
  SSGOI_TRANSITION_BEFORE,
  STAR_PATTERN_AFTER,
  STAR_PATTERN_BEFORE,
  UNPLUGIN_AFTER,
  UNPLUGIN_BEFORE,
} from "@/page/docs/migration-v8-examples";

const body = `${measure} ${prose}`;

const c = (value: string) => <code className={inlineCode}>{value}</code>;

function BeforeAfter({
  before,
  after,
  language = "tsx",
}: {
  before: string;
  after: string;
  language?: string;
}) {
  return (
    <div className="mt-5 flex flex-col gap-4">
      <div>
        <p className={caption}>7.x</p>
        <CodeBlock className="mt-2" language={language} code={before} />
      </div>
      <div>
        <p className={caption}>8.0</p>
        <CodeBlock className="mt-2" language={language} code={after} />
      </div>
    </div>
  );
}

const AT_A_GLANCE: ReactNode[][] = [
  [
    <>
      Router subpaths such as {c("@ssgoi/react/nextjs")},{" "}
      {c("@ssgoi/svelte/sveltekit")}, {c("@ssgoi/vue/nuxt")} and their{" "}
      {c("SsgoiRouteBoundary")} / {c("useSsgoiRouteBoundary")}
    </>,
    <>
      {c("<Ssgoi framework>")} plus {c("SsgoiLayoutBoundary")} (Qwik:{" "}
      {c("useSsgoiLayoutBoundary")}) from the package root
    </>,
  ],
  [
    <>
      {c("routeKey")}, Angular {c("key:")} and {c("useSsgoiRouteBoundary(key)")}
    </>,
    <>A scope in {c("config.layouts")}</>,
  ],
  [
    <>
      {c("resolve")}, {c("parallelRoutesKey")}, {c("fallback")},{" "}
      {c("selectedSegmentsToPath")}
    </>,
    <>See boundary props below; most have no prop equivalent</>,
  ],
  [
    <>
      {c("SsgoiTransition")} (every framework, Angular {c("[ssgoiTransition]")})
    </>,
    <>{c("data-ssgoi-transition")} on the element your framework keys</>,
  ],
  [c("@ssgoi/react/unplugin"), <>Nothing: remove it from the bundler config</>],
  [c('axis({ feel: "snappy" })'), c('axis({ variant: "snappy" })')],
  [c('axis({ feel: "fluid" })'), c("axis()")],
  [c('drill({ type: "crossfade" })'), c('drill({ type: "slide" })')],
  [c('sheet({ type: "background-scale" })'), c('sheet({ type: "scale" })')],
  [c("zoom({ fade: true })"), c('zoom({ variant: "fade" })')],
  [
    c("data-hero-key"),
    <>
      {c("data-hero-exit-key")} on the page you leave,{" "}
      {c("data-hero-enter-key")} on the page you arrive at
    </>,
  ],
  [
    c("data-hero-aspect-ratio"),
    <>Nothing: the image&apos;s own dimensions and {c("object-fit")}</>,
  ],
  [
    <>
      {c("data-hero-radius")}, {c("data-zoom-radius")}
    </>,
    <>Nothing: CSS {c("border-radius")} on the keyed element or its clip</>,
  ],
  [<>Route pattern {c('"*"')}</>, c('"/**"')],
  [
    c("IntegratorProvider.fromSpring(config)"),
    c("IntegratorProvider.from({ spring: config })"),
  ],
  [
    c("animation.set(name, { integrator })"),
    c("animation.select(name).set({ integrator })"),
  ],
];

const SILENT: ReactNode[][] = [
  [c('drill({ type: "crossfade" })'), "Plays the default parallax drill."],
  [c('sheet({ type: "background-scale" })'), "Plays the default static sheet."],
  [c('axis({ feel: "snappy" })'), "Ignored; plays the default x axis."],
  [c("zoom({ fade: true })"), "Ignored; plays the default variant."],
  [c("data-hero-key"), "No pair is found, so Hero does nothing."],
  [
    <>
      {c("data-hero-aspect-ratio")}, {c("data-hero-radius")},{" "}
      {c("data-zoom-radius")}
    </>,
    "Ignored; geometry comes from the DOM and CSS.",
  ],
  [
    c('"*"'),
    <>
      Read as {c("/*")}: matches single-segment paths such as {c("/posts")}{" "}
      only.
    </>,
  ],
  [
    c('animation.set("in", { … })'),
    "The string is taken as an empty patch; nothing changes.",
  ],
];

const BOUNDARY_PROPS: ReactNode[][] = [
  [
    <>
      {c("routeKey")} (every framework), Angular {c("key:")}, Qwik{" "}
      {c("useSsgoiRouteBoundary(key)")}
    </>,
    <>
      Declare the section in {c("config.layouts")}. A boundary at depth N keys
      by the scope that matches at depth N, so it stays mounted while navigation
      stays inside it.
    </>,
  ],
  [
    <>{c("resolve(location)")} returning a custom id</>,
    <>
      The id is the route path your {c("framework")} returns. Strip locale or
      tenant prefixes with {c("config.middleware")}, or return the path you want
      matched from {c("useRoute")}/{c("getRoute")}. For anything else, write a{" "}
      <Link href="/docs/boundaries#manual-boundary" className={link}>
        keyed boundary yourself
      </Link>
      .
    </>,
  ],
  [
    <>
      Next.js {c("resolve")} with {c("selectedSegments")} for a modal
    </>,
    <>
      Return {c("renderedPath")} from {c("useRoute")}, as in the Next.js snippet
      above.
    </>,
  ],
  [
    <>Next.js {c("parallelRoutesKey")}</>,
    <>
      No replacement. The first boundary follows the {c("children")} slot of the
      layout that renders it; render other slots outside boundaries.
    </>,
  ],
  [
    <>Next.js {c("fallback")}</>,
    <>
      No replacement. The first boundary renders nothing until the route is
      known.
    </>,
  ],
  [
    <>Next.js {c("selectedSegmentsToPath")}</>,
    <>
      No export. Compute {c("renderedPath")} inside {c("useRoute")}.
    </>,
  ],
  [
    <>
      Expo {c("resolve")} and {c("routeKey")}
    </>,
    <>
      No replacement. Each screen keys by its own native route; Expo&apos;s
      nested navigators define shared layouts.
    </>,
  ],
];

const REMOVED_TYPES: ReactNode[][] = [
  [c("TrackPatch"), c("AnimationPatch")],
  [c("SsgoiTransitionsOption"), c('NonNullable<SsgoiConfig["transitions"]>')],
  [c("AxisFeelDeprecated"), c("AxisXVariant")],
  [c("DrillTypeDeprecated"), c("DrillType")],
  [c("SheetTypeDeprecated"), c("SheetType")],
  [
    <>
      {c("RouteBoundaryState")}, {c("SsgoiRouteBoundaryProps")} and the router
      location types ({c("NextjsRouteLocation")}, {c("RemixRouteLocation")},{" "}
      {c("SveltekitRouteLocation")}, {c("AngularRouteLocation")},{" "}
      {c("ExpoRouteLocation")})
    </>,
    <>
      {c("SsgoiFramework")} for the route object;{" "}
      {c("SsgoiLayoutBoundaryProps")} where the package exports it
    </>,
  ],
];

export function MigrationV8Body() {
  return (
    <div className="mt-8">
      <p className={body}>
        SSGOI 8.0.0 is a cleanup release. It adds no new behavior: it deletes
        the compatibility code 7.x kept for older code. Every removed API
        already had a replacement in 7.x, so if your app uses{" "}
        {c("<Ssgoi framework>")} with {c("SsgoiLayoutBoundary")} and none of the
        names below, the upgrade is a version bump.
      </p>

      <Section
        title="Upgrade every package together"
        lead="All @ssgoi/* packages are versioned in lockstep. Move each one you install to the same 8.x version."
      >
        <CodeBlock
          className="mt-6"
          language="bash"
          code={`npm install @ssgoi/react@8   # or svelte, vue, solid, qwik, angular, react-native`}
        />
        <p className={`mt-5 ${body}`}>
          The framework package brings {c("@ssgoi/core")} with it; if you also
          import {c("@ssgoi/core")} directly, upgrade it to 8 as well. The
          packages no longer list any router as an optional peer dependency.
        </p>
      </Section>

      <Section
        title="Find what needs to change"
        lead="Search the source for every removed name before you upgrade."
      >
        <CodeBlock className="mt-6" language="bash" code={FIND_USAGES} />
        <p className={`mt-5 ${body}`}>
          Removed subpaths and exports fail at build time, and TypeScript flags
          the removed options. A missing {c("framework")} makes{" "}
          {c("SsgoiLayoutBoundary")} throw an {c("SSGOI:")} error. Without
          types, the changes below fail silently instead:
        </p>
        <DocsTable
          head={["7.x code", "What it does on 8.0"]}
          rows={SILENT}
          minWidth="560px"
        />
      </Section>

      <Section
        title="Removed APIs at a glance"
        lead="Each row is covered with a before and after snippet in the sections below."
      >
        <DocsTable
          head={["Removed in 8.0", "Use instead"]}
          rows={AT_A_GLANCE}
          minWidth="620px"
        />
      </Section>

      <Section
        title="Router subpaths and SsgoiRouteBoundary"
        lead="The provider now reads your router through a framework object, and the boundary comes from the package root."
      >
        <p className={`mt-4 ${body}`}>
          In 7.x each router had its own entry ({c("@ssgoi/react/nextjs")},{" "}
          {c("/remix")}, {c("/react-router")}, {c("/tanstack-router")},{" "}
          {c("@ssgoi/svelte/sveltekit")}, {c("@ssgoi/vue/vue-router")},{" "}
          {c("/nuxt")}, {c("@ssgoi/solid/solid-router")}, {c("/solidstart")},{" "}
          {c("@ssgoi/qwik/qwik-city")}, {c("@ssgoi/angular/router")},{" "}
          {c("@ssgoi/react-native/expo-router")}) that imported the router and
          exported a route boundary. In 8.0 those entries are gone. Pass a{" "}
          {c("framework")} object to {c("<Ssgoi>")} that reads your router, and
          replace the boundary with {c("SsgoiLayoutBoundary")} from the same
          package root. Keep the object at module scope so it stays stable. Your
          config and transition rules do not change.
        </p>
        {ROUTER_EXAMPLES.map((example) => (
          <div key={example.id} className="mt-10">
            <Heading3 id={`router-${example.id}`}>{example.title}</Heading3>
            {example.note && <p className={`mt-2 ${body}`}>{example.note}</p>}
            <BeforeAfter
              before={example.before}
              after={example.after}
              language={example.language}
            />
          </div>
        ))}
        <p className={`mt-8 ${body}`}>
          Each{" "}
          <Link href="/docs/frameworks" className={link}>
            framework guide
          </Link>{" "}
          has the complete files, including the layout shell around{" "}
          {c("<Ssgoi>")}.
        </p>
      </Section>

      <Section
        title="Boundary props: routeKey, resolve and the rest"
        lead="SsgoiLayoutBoundary takes no SSGOI props. Its id is the route path and its key comes from config.layouts."
      >
        <DocsTable
          head={["7.x prop", "8.0"]}
          rows={BOUNDARY_PROPS}
          minWidth="620px"
        />
        <p className={`mt-6 ${body}`}>
          The most common case is a persistent shell that kept its tabs mounted
          with a fixed {c("routeKey")}:
        </p>
        <BeforeAfter before={ROUTE_KEY_BEFORE} after={ROUTE_KEY_AFTER} />
        <p className={`mt-5 ${body}`}>
          <Link href="/docs/nested-boundaries" className={link}>
            Persistent layouts
          </Link>{" "}
          covers nested scopes, per-instance shells such as {c("/projects/:id")}
          , and tab layouts in depth.
        </p>
      </Section>

      <Section
        title="SsgoiTransition"
        lead="It only marked an element with data-ssgoi-transition. Write the attribute yourself."
      >
        <p className={`mt-4 ${body}`}>
          SSGOI discovers marked elements under the provider on its own. The
          element still needs a key that changes when the route changes; the
          attribute names the route, the remount starts the transition. For
          routed pages, {c("SsgoiLayoutBoundary")} sets both for you.
        </p>
        <BeforeAfter
          before={SSGOI_TRANSITION_BEFORE}
          after={SSGOI_TRANSITION_AFTER}
        />
      </Section>

      <Section
        title="React unplugin"
        lead="@ssgoi/react/unplugin and its /vite, /webpack, /rollup and /esbuild entries are removed with no replacement."
      >
        <p className={`mt-4 ${body}`}>
          The plugin injected keys into calls to an element-level{" "}
          {c("transition()")} helper that the packages no longer export, so it
          has nothing left to do. Remove it from your bundler config.
        </p>
        <BeforeAfter
          before={UNPLUGIN_BEFORE}
          after={UNPLUGIN_AFTER}
          language="ts"
        />
      </Section>

      <Section
        title="Preset options"
        lead="Four option names that were renamed in earlier releases lose their old spelling. The motion is the same."
      >
        <BeforeAfter
          before={PRESET_OPTIONS_BEFORE}
          after={PRESET_OPTIONS_AFTER}
          language="ts"
        />
        <p className={`mt-5 ${body}`}>
          {c('feel: "fluid"')} was already the default tone of the x axis, so
          drop it. The{" "}
          <Link href="/docs/transitions" className={link}>
            transition pages
          </Link>{" "}
          list every {c("type")} and {c("variant")}.
        </p>
      </Section>

      <Section
        title="Hero and zoom markup"
        lead="Shared elements are paired by explicit enter and exit keys, and their geometry is read from the DOM."
      >
        <Heading3>data-hero-key</Heading3>
        <p className={`mt-2 ${body}`}>
          Put {c("data-hero-exit-key")} on the element you leave from and{" "}
          {c("data-hero-enter-key")} on the element you arrive at, with the same
          value. The roles also hold on the way back, so Hero no longer needs
          the history direction to choose which side flies above the pages.
        </p>
        <BeforeAfter before={HERO_KEY_BEFORE} after={HERO_KEY_AFTER} />

        <div className="mt-10">
          <Heading3>Aspect ratio and radius hints</Heading3>
        </div>
        <p className={`mt-2 ${body}`}>
          {c("data-hero-aspect-ratio")}, {c("data-hero-radius")} and{" "}
          {c("data-zoom-radius")} are no longer read, and there is no override
          left. Put the key on an {c("<img>")}, or on a wrapper with exactly one
          direct {c("<img>")} child. The ratio comes from the image&apos;s
          natural size, or from its {c("width")} and {c("height")} attributes
          before it loads; the fit comes from a centered {c("object-fit:")}{" "}
          {c("cover")} or {c("contain")}. Corners come from a uniform CSS{" "}
          {c("border-radius")} on the keyed element or a clipping ancestor
          inside the page.
        </p>
        <BeforeAfter before={MEDIA_HINTS_BEFORE} after={MEDIA_HINTS_AFTER} />
      </Section>

      <Section
        title="Route patterns"
        lead='A bare "*" is no longer an alias for every path.'
      >
        <BeforeAfter
          before={STAR_PATTERN_BEFORE}
          after={STAR_PATTERN_AFTER}
          language="ts"
        />
        <p className={`mt-5 ${body}`}>
          Check {c("on")}, {c("except")}, {c("from")}, {c("to")} and{" "}
          {c("config.layouts")} paths. A bare {c('"*"')} left in place is read
          as {c("/*")}, which matches only single-segment paths.
        </p>
      </Section>

      <Section
        title="Motion APIs"
        lead="Two helpers that predate select() are removed."
      >
        <BeforeAfter
          before={MOTION_BEFORE}
          after={MOTION_AFTER}
          language="ts"
        />
        <div className="mt-6">
          <Note>
            {c("select(name).set()")} takes an integrator instance, not the{" "}
            {c("{ spring }")} shape the old two-argument {c("set")} accepted.
            Wrap physics with {c("spring()")} or{" "}
            {c("IntegratorProvider.from()")}; anything without {c("step")} and{" "}
            {c("isSettled")} throws.
          </Note>
        </div>
      </Section>

      <Section
        title="Removed types"
        lead="Type-only exports that described the removed APIs."
      >
        <DocsTable
          head={["Removed type", "Use instead"]}
          rows={REMOVED_TYPES}
          minWidth="560px"
        />
      </Section>

      <Section
        title="Staying on 7.5"
        lead="If you are not ready to migrate, keep every package on 7."
      >
        <CodeBlock
          className="mt-6"
          language="bash"
          code={`npm install @ssgoi/react@7`}
        />
        <p className={`mt-5 ${body}`}>
          7.5 has the new interface alongside the deprecated one, so you can
          move one call site at a time there and upgrade to 8 once the search
          above comes back empty.
        </p>
      </Section>

      <NextLinks
        links={[
          {
            href: "/docs/frameworks",
            title: "Frameworks",
            body: "The framework object and boundary for each router.",
          },
          {
            href: "/docs/boundaries",
            title: "Route boundaries",
            body: "What the key and the id each decide.",
          },
          {
            href: "/docs/nested-boundaries",
            title: "Persistent layouts",
            body: "config.layouts in place of routeKey.",
          },
        ]}
      />

      <p className={`mt-8 ${caption}`}>
        Agent-oriented version:{" "}
        <a
          href="https://ssgoi.dev/llms/migration-v8.txt"
          target="_blank"
          rel="noreferrer"
          className={link}
        >
          /llms/migration-v8.txt
        </a>
      </p>
    </div>
  );
}
