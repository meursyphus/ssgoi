import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import {
  PageHeading,
  Section,
  NextLinks,
  prose,
  measure,
  DocsTable,
} from "@/page/docs/ui";
import {
  CUSTOM_TRANSITION_EXAMPLE,
  CUSTOM_OVERRIDE_EXAMPLE,
  CUSTOM_INTEGRATOR_EXAMPLE,
} from "@/page/docs/motion-examples";

export const metadata: Metadata = {
  title: "Custom transitions — defineTransition and custom integrators",
  description:
    "Write typed SSGOI transitions with independent forward/backward preparation, named composite animations, and custom physical integrators.",
  alternates: { canonical: "/docs/custom-transitions" },
};

export default function CustomTransitionsPage() {
  return (
    <>
      <PageHeading
        title="Custom transitions"
        lead="Define the preparation and animation for each direction. SSGOI keeps the types connected and handles route playback."
      />
      <Section
        title="Pair preparation with its animation"
        lead="This transition returns a named MultiAnimation going forward and a single WebAnimation going backward. Each direction infers its own prepared values and return type."
      >
        <CodeBlock
          className="mt-6"
          language="ts"
          code={CUSTOM_TRANSITION_EXAMPLE}
        />
        <p className={`mt-5 ${measure} ${prose}`}>
          Both factories return fresh animations. The core calls only the
          selected direction's preparation and factory. Shared helpers are
          useful when both directions use the same geometry or cleanup; they do
          not need duplicate implementations.
        </p>
      </Section>
      <Section
        title="Keep concrete types in overrides"
        lead="withOverride creates a retuned definition while leaving the original reusable. The selected animation type comes from that direction's factory."
      >
        <CodeBlock
          className="mt-6"
          language="ts"
          code={CUSTOM_OVERRIDE_EXAMPLE}
        />
        <p className={`mt-5 ${measure} ${prose}`}>
          defineTransition also accepts a second argument containing override.
          The core consumes the common Animation contract; it does not require
          your factory to return MultiAnimation. Avoid annotating a factory with
          a broad Animation return type when you want its specific methods and
          named children available in overrides.
        </p>
      </Section>
      <Section title="Understand the lifecycle">
        <DocsTable
          head={["Stage", "Responsibility"]}
          rows={[
            [
              "Core direction",
              "Route rules and history choose forward or backward once.",
            ],
            [
              "prepare",
              "Stage initial styles; return per-run data. from and to are promises.",
            ],
            [
              "DOM insertion",
              "The core inserts the outgoing page after preparation.",
            ],
            [
              "animation",
              "Measure the inserted DOM and return a fresh Animation.",
            ],
            ["override", "Retune the chosen animation before it plays."],
            [
              "Playback and completion",
              "The host owns playback; your callbacks restore styles and the core removes tracked temporary nodes.",
            ],
          ]}
        />
        <p className={`mt-5 ${measure} ${prose}`}>
          Keep snapshots and DOM references in prepared data or per-animation
          closures. Preparations from different navigations may overlap, so
          reusable providers must not store a single current page or prepared
          result.
        </p>
        <p className={`mt-4 ${measure} ${prose}`}>
          Use createElement in prepare for temporary nodes the core should
          remove. Restore changed inline styles on reused pages. After a
          WebAnimation completes, releaseFill removes its WAAPI fill so those
          restored styles take effect. Layout measurements that require the
          outgoing node to be inserted belong in animation.
        </p>
      </Section>
      <Section
        title="Implement your own integrator"
        lead="An integrator receives position, velocity, the current target, and a time step in seconds. This example uses an exact critically damped spring step."
      >
        <CodeBlock
          className="mt-6"
          language="ts"
          code={CUSTOM_INTEGRATOR_EXAMPLE}
        />
        <p className={`mt-5 ${measure} ${prose}`}>
          Mutable simulation state belongs in the state argument. The animation
          engine decides when to simulate and apply styles. WebAnimation can
          adopt a pose for a new run; cross-composite pose handoff is not yet
          implemented by MultiAnimation.matchInto. A custom integrator alone
          does not add that capability.
        </p>
      </Section>
      <Section
        title="Let the core own direction"
        lead="Element roles do not change navigation direction."
      >
        <p className={`mt-4 ${measure} ${prose}`}>
          An explicit gallery → photo/* rule makes detail → gallery backward
          even when a bottom navigation link performs a new push. For photo/* →
          photo/*, history resolves the otherwise equal patterns: a fresh push
          is forward and browser Back reverses the recorded transition.
        </p>
        <p className={`mt-4 ${measure} ${prose}`}>
          Zoom and Hero keep their enter/exit keys. An enter marker identifies
          expanded media, while an exit marker identifies its thumbnail or card.
          A detail page can contain its own enter-marked photo and exit-marked
          related photos. Zoom uses the core direction to choose the pairing; it
          never replaces context.direction.
        </p>
      </Section>
      <NextLinks
        links={[
          {
            href: "/docs/motion",
            title: "Motion overrides",
            body: "Select named groups and control their physics or overlap.",
          },
          {
            href: "/docs/route-rules",
            title: "Route rules",
            body: "Define the relationship that gives direction its meaning.",
          },
          {
            href: "/llms/custom-transitions.txt",
            title: "Agent reference",
            body: "A copyable custom transition and lifecycle contract.",
          },
        ]}
      />
    </>
  );
}
