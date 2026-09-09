import {
  createRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AppState,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type {
  NavigatorArgs,
  NavigatorDescriptor,
  NavigatorRoute,
} from "standard-navigation";
import { normalizePath } from "@ssgoi/core/runtime";
import {
  createPresence,
  reconcilePresence,
  settlePresence,
  type Screen,
} from "./presence.js";
import { NativeRouteSurface } from "./native-route-surface.js";
import { useNativePlayback } from "./playback.js";
import { useSsgoi } from "./ssgoi.js";
import type { RouteBoundaryState } from "./types.js";
import type { NativeSurfaceHandle } from "./native-surface-handle.js";

export interface ExpoRouteLocation {
  pathname: string;
  route: Readonly<NavigatorRoute>;
}
export interface BoundaryOptions {
  style?: StyleProp<ViewStyle>;
  /** Evaluated against each screen's own route, including retained screens. */
  resolve?: (location: ExpoRouteLocation) => RouteBoundaryState;
  /** Scoped by the native route key; never merges distinct pushed screen instances. */
  routeKey?: string | number;
}
export type NavigatorEvents = {
  transitionStart: { data: { closing: boolean }; canPreventDefault: false };
  transitionEnd: { data: { closing: boolean }; canPreventDefault: false };
};
export type ScreenOptions = Record<string, never>;
type ContentProps = NavigatorArgs<ScreenOptions, NavigatorEvents> &
  BoundaryOptions;
type Scene = {
  descriptor: NavigatorDescriptor<ScreenOptions>;
  boundaryKey: string;
};

function screenFor(
  route: NavigatorRoute,
  descriptor: NavigatorDescriptor<ScreenOptions>,
  namespace: string,
  options: BoundaryOptions,
  target?: NativeSurfaceHandle,
): Screen<Scene> {
  const pathname = route.href?.startsWith("/")
    ? normalizePath(route.href)
    : null;
  const resolved =
    pathname === null
      ? null
      : (options.resolve?.({ pathname, route }) ?? { id: pathname });
  if (
    resolved &&
    (typeof resolved.id !== "string" || !resolved.id.startsWith("/"))
  ) {
    throw new Error(
      "SSGOI: resolve must return an absolute route id such as /posts/42.",
    );
  }
  return {
    key: route.key,
    path: resolved?.id ?? null,
    target: target ?? {
      key: JSON.stringify([namespace, route.key]),
      ref: createRef<View>(),
    },
    value: {
      descriptor,
      boundaryKey: JSON.stringify([
        namespace,
        route.key,
        options.routeKey ?? resolved?.key ?? route.key,
      ]),
    },
  };
}

/** The Expo subpath supplies router descriptors; native rendering remains independent of Expo. */
export function NativeNavigator({
  state,
  descriptors,
  emitter,
  style,
  resolve,
  routeKey,
}: ContentProps) {
  const ssgoi = useSsgoi();
  const namespace = useId();
  const window = useWindowDimensions();
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const [readyKeys, setReadyKeys] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const activeKey = state.routes[state.index]?.key ?? null;
  const [snapshot, setSnapshot] = useState(() => ({
    navigation: null as typeof state | null,
    resolve,
    routeKey,
    presence: createPresence<NativeSurfaceHandle, Scene>([], null),
  }));
  const targets = new Map(
    snapshot.presence.entries.map((screen) => [screen.key, screen.target]),
  );
  // Standard navigation appends preloaded routes after index. They are not active stack entries.
  const routes = state.routes.slice(0, state.index + 1);
  const screens = routes.map((route) => {
    const descriptor = descriptors[route.key];
    if (!descriptor)
      throw new Error(`SSGOI: missing route descriptor for ${route.name}.`);
    return screenFor(
      route,
      descriptor,
      namespace,
      { resolve, routeKey },
      targets.get(route.key),
    );
  });
  const liveScenes = new Map(
    screens.map((screen) => [screen.key, screen.value]),
  );
  let current = snapshot;
  if (
    snapshot.navigation !== state ||
    snapshot.resolve !== resolve ||
    snapshot.routeKey !== routeKey
  ) {
    current = {
      navigation: state,
      resolve,
      routeKey,
      presence: reconcilePresence(snapshot.presence, screens, activeKey),
    };
    // Derive retained siblings before commit: effect cleanup would already be too late.
    setSnapshot(current);
  }
  const presence = current.presence;
  const transition = presence.transition;
  const id = transition?.id ?? presence.generation;
  const width = layout.width || window.width;
  const prepared = useMemo(() => {
    if (!transition?.from.path || !transition.to.path || ssgoi.reducedMotion)
      return { plan: null, error: null };
    try {
      return {
        plan: ssgoi.platform.prepare(
          ssgoi.config,
          transition.from.path,
          transition.to.path,
          transition.direction,
          width,
        ),
        error: null,
      };
    } catch (error) {
      return {
        plan: null,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }, [transition, ssgoi.config, ssgoi.platform, ssgoi.reducedMotion, width]);
  const finish = useCallback((generation: number) => {
    setSnapshot((previous) => {
      const next = settlePresence(previous.presence, generation);
      return next === previous.presence
        ? previous
        : { ...previous, presence: next };
    });
  }, []);
  const ready =
    layout.width > 0 &&
    layout.height > 0 &&
    !!transition &&
    readyKeys.has(transition.to.key);
  const playback = useNativePlayback(
    id,
    transition ? prepared.plan : null,
    ready,
    finish,
  );

  useLayoutEffect(() => {
    if (!transition) return;
    if (!prepared.plan) {
      finish(transition.id);
      if (prepared.error) ssgoi.onTransitionError?.(prepared.error);
    }
  }, [transition, prepared, finish, ssgoi.onTransitionError]);

  useEffect(() => {
    if (!transition) return;
    // Bounds preparation when a screen remains suspended or cannot be measured.
    const timeout = setTimeout(
      () => finish(transition.id),
      1500 + (prepared.plan?.duration ?? 0),
    );
    const subscription = AppState.addEventListener("change", (next) => {
      if (next === "background" || next === "inactive") finish(transition.id);
    });
    if (
      AppState.currentState === "background" ||
      AppState.currentState === "inactive"
    )
      finish(transition.id);
    return () => {
      clearTimeout(timeout);
      subscription.remove();
    };
  }, [transition, prepared.plan, finish]);

  useEffect(() => {
    if (!transition || !prepared.plan || !ready) return;
    const pair = [transition.from.key, transition.to.key];
    for (const key of pair)
      emitter.emit({
        type: "transitionStart",
        target: key,
        data: { closing: key === transition.from.key },
      });
    return () => {
      for (const key of pair)
        emitter.emit({
          type: "transitionEnd",
          target: key,
          data: { closing: key === transition.from.key },
        });
    };
  }, [transition, prepared.plan, ready, emitter]);

  useEffect(() => {
    const keys = new Set(presence.entries.map((s) => s.key));
    setReadyKeys((previous) =>
      [...previous].every((key) => keys.has(key))
        ? previous
        : new Set([...previous].filter((key) => keys.has(key))),
    );
  }, [presence.entries]);

  const onLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout;
    if (
      layout.width > 0 &&
      layout.height > 0 &&
      (next.width !== layout.width || next.height !== layout.height)
    )
      finish(id);
    if (next.width !== layout.width || next.height !== layout.height)
      setLayout({ width: next.width, height: next.height });
  };
  return (
    <View style={[{ flex: 1, overflow: "hidden" }, style]} onLayout={onLayout}>
      {presence.entries.map((entry) => {
        // Live routes get updated options/context; a removed outgoing route keeps its last descriptor.
        const scene = liveScenes.get(entry.key) ?? entry.value;
        const side =
          transition?.from.key === entry.key
            ? "out"
            : transition?.to.key === entry.key
              ? "in"
              : null;
        return (
          <NativeRouteSurface
            key={entry.key}
            target={entry.target}
            active={entry.key === activeKey}
            side={side}
            id={id}
            width={width}
            plan={side ? prepared.plan : null}
            playback={playback}
            onLayout={(event) => {
              if (
                event.nativeEvent.layout.width > 0 &&
                event.nativeEvent.layout.height > 0
              ) {
                setReadyKeys((previous) =>
                  previous.has(entry.key)
                    ? previous
                    : new Set([...previous, entry.key]),
                );
              }
            }}
          >
            <SceneContent key={scene.boundaryKey}>
              {scene.descriptor.render()}
            </SceneContent>
          </NativeRouteSurface>
        );
      })}
    </View>
  );
}

function SceneContent({ children }: { children: ReactNode }) {
  return children;
}
