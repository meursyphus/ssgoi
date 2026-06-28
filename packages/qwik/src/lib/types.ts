import type { QRL } from "@builder.io/qwik";
import type { HostAnimation } from "@ssgoi/core/internal";
import type { SsgoiConfig } from "@ssgoi/core/types";

export * from "@ssgoi/core/types";

export type SsgoiConfigFactory = () => SsgoiConfig | Promise<SsgoiConfig>;
export type SsgoiHostFactory = () =>
  | HostAnimation
  | undefined
  | Promise<HostAnimation | undefined>;

export type SsgoiConfigQrl = QRL<SsgoiConfigFactory>;
export type SsgoiHostQrl = QRL<SsgoiHostFactory>;
