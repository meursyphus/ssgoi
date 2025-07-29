import { CodeTabs } from '../code-tabs';

export function BasicConfig() {
  return (
    <CodeTabs
      react={`import { Ssgoi } from "@ssgoi/react";
import { fade, slide } from "@ssgoi/react/view-transitions";

const config = {
  defaultTransition: fade(),
  transitions: [
    { from: "/", to: "/about", transition: slide({ direction: "left" }) },
    { from: "/about", to: "/", transition: slide({ direction: "right" }) },
  ],
};

<Ssgoi config={config}>{children}</Ssgoi>;`}
      svelte={`<script>
  import { Ssgoi } from "@ssgoi/svelte";
  import { fade, slide } from "@ssgoi/svelte/view-transitions";
  
  const config = {
    defaultTransition: fade(),
    transitions: [
      { from: "/", to: "/about", transition: slide({ direction: "left" }) },
      { from: "/about", to: "/", transition: slide({ direction: "right" }) },
    ],
  };
</script>

<Ssgoi {config}>
  <slot />
</Ssgoi>`}
    />
  );
}