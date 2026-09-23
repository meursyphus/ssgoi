import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import {
  PageHeading,
  Section,
  DocsTable,
  NextLinks,
  prose,
  measure,
  inlineCode,
} from "@/page/docs/ui";
import { OVERRIDE_EXAMPLE } from "@/page/docs/motion-examples";

export const metadata: Metadata = {
  title: "Motion overrides — physics and overlap",
  description:
    "Retune SSGOI presets by direction with typed named animations, custom integrators, and progress or completion start conditions.",
  alternates: { canonical: "/docs/motion" },
};

export default function MotionPage() {
  return (
    <>
      <PageHeading
        title="Motion overrides"
        lead="Keep the preset's effect and tune the physics or overlap you want to change."
      />
      <Section
        title="Choose the effect, then override its motion"
        lead="The second argument is an override object. Each callback receives the animation built for that direction, with its registered child names inferred."
      >
        <CodeBlock className="mt-6" language="ts" code={OVERRIDE_EXAMPLE} />
        <p className={`mt-5 ${measure} ${prose}`}>
          Omitted directions and properties keep their preset defaults.
          Callbacks run before playback and receive the original core context.
          The route rule and history decide forward/backward; the preset does
          not change that decision.
        </p>
      </Section>
      <Section
        title="Select a named animation"
        lead="A selected child can contain one element or a whole group. Its name is registered by the preset, so it does not depend on DOM order."
      >
        <DocsTable
          head={["Preset", "Names"]}
          rows={[
            [
              "Axis, Drill, Slide, Fade, Scroll, Strip, Rotate, Jaemin",
              "out, in",
            ],
            ["Blind", "out, in — each contains its strips"],
            ["Sheet", "sheet, background, overlay"],
            ["Zoom", "tile, background, content, overlay"],
            ["Hero", "shared, out, in"],
            ["Film", "out, in, borders"],
          ]}
        />
        <p className={`mt-5 ${measure} ${prose}`}>
          <code className={inlineCode}>animation.select("in").set(...)</code>{" "}
          changes the selected group.{" "}
          <code className={inlineCode}>animation.set(...)</code> explicitly
          changes the whole composite. Use the whole composite when its surfaces
          should share the same progress. Missing optional effects remain empty
          named groups.
        </p>
        <p className={`mt-4 ${measure} ${prose}`}>
          Film retains its baked scale and translation choreography. An
          integrator override changes progression through that path; its
          internal scale-down, translate, and scale-up springs are not separate
          public children.
        </p>
      </Section>
      <Section
        title="Choose first arrival or complete settling"
        lead="Start conditions reference sibling animations. A numeric threshold and a completion condition have different meanings."
      >
        <CodeBlock
          className="mt-6"
          language="ts"
          code={`const outgoing = animation.select("out");
const incoming = animation.select("in");

// Start when outgoing first reaches 30% progress.
incoming.set({ startAt: { after: outgoing, at: 0.3 } });

// Or wait until outgoing has completely settled.
incoming.set({ startAt: { after: outgoing, at: "settled" } });`}
        />
        <p className={`mt-5 ${measure} ${prose}`}>
          A spring can overshoot 100% before it settles. Numeric 1 means its
          first crossing, while "settled" waits for completion. The existing
          positional startAt arrays and sequence shorthand preserve their
          numeric first-crossing behavior. Set timing before playback;
          references outside the parent, cycles, and invalid thresholds are
          rejected.
        </p>
      </Section>
      <Section
        title="Use physical parameters"
        lead="Springs accept stiffness and damping. You can pass a built-in class, a semantic preset, or your own Integrator instance."
      >
        <CodeBlock
          className="mt-6"
          language="ts"
          code={`import { spring, SpringIntegrator, InertiaIntegrator, scale, snappy } from "@ssgoi/core";

spring({ stiffness: 320, damping: 30 });
new SpringIntegrator({ stiffness: 320, damping: 30 });
new InertiaIntegrator({ acceleration: 150, resistance: 1.5 });
scale(snappy, 1.2); // Preserve its curve and run it faster.`}
        />
        <p className={`mt-5 ${measure} ${prose}`}>
          The web adapters re-export these helpers, including @ssgoi/react. A
          spring does not accept a duration/bounce recipe. Keep integrator
          instances stateless so animations can share them safely.
        </p>
      </Section>
      <NextLinks
        links={[
          {
            href: "/docs/custom-transitions",
            title: "Write a custom transition",
            body: "Define each direction and keep its concrete animation type.",
          },
          {
            href: "/docs/route-rules",
            title: "Route direction",
            body: "How links, bottom navigation, and browser Back select a direction.",
          },
          {
            href: "/llms/motion.txt",
            title: "Agent reference",
            body: "The complete API in plain text.",
          },
        ]}
      />
    </>
  );
}
