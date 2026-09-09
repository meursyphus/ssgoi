import { useEffect, useState } from "react";
import { AppState, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  act,
  renderRouter,
  screen,
  fireEvent,
  cleanup,
} from "expo-router/testing-library";
import { Ssgoi } from "../src/ssgoi";
import { SsgoiRouteBoundary } from "../src/expo-router";
import { slide } from "../src/view-transitions";
import { activeClocks, advanceFrames } from "./frame-clock";

const mounts: string[] = [];
const unmounts: string[] = [];
const config = { transitions: [{ on: "/posts/*", transition: slide() }] };
function Layout() {
  return (
    <Ssgoi config={config} reducedMotion="never">
      <SsgoiRouteBoundary />
    </Ssgoi>
  );
}
function Posts() {
  const [value, setValue] = useState("");
  useEffect(() => {
    mounts.push("list");
    return () => {
      unmounts.push("list");
    };
  }, []);
  return (
    <View>
      <Text>Posts</Text>
      <TextInput testID="note" value={value} onChangeText={setValue} />
    </View>
  );
}
function Post() {
  const { id } = useLocalSearchParams<{ id: string }>();
  useEffect(() => {
    mounts.push(`post:${id}`);
    return () => {
      unmounts.push(`post:${id}`);
    };
  }, []);
  return <Text testID={`post-${id}`}>Post {id}</Text>;
}
function start(initialUrl = "/posts") {
  return renderRouter(
    { _layout: Layout, "posts/index": Posts, "posts/[id]": Post },
    { initialUrl },
  );
}
function layoutViews() {
  // Native renderers deliver these layout events; the test renderer requires explicit measurements.
  for (const view of screen.UNSAFE_getAllByType(View)) {
    if (view.props.onLayout)
      fireEvent(view, "layout", {
        nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 844 } },
      });
  }
}
async function finishAnimation() {
  await act(async () => {
    advanceFrames(2500);
    jest.runAllTicks();
  });
}
beforeEach(() => {
  mounts.length = 0;
  unmounts.length = 0;
});
afterEach(() => {
  cleanup();
  jest.useRealTimers();
});

test("file-discovered routes retain list state and the popped descriptor until playback completes", async () => {
  start();
  layoutViews();
  fireEvent.changeText(screen.getByTestId("note"), "keep this note");
  await act(async () => router.push("/posts/42"));
  layoutViews();
  expect(screen.getByTestId("post-42")).toHaveTextContent("Post 42");
  expect(mounts).toEqual(["list", "post:42"]);
  await finishAnimation();
  await act(async () => router.back());
  layoutViews();
  // The route no longer belongs to the router state, but its original React instance survives.
  expect(
    screen.getByTestId("post-42", { includeHiddenElements: true }),
  ).toHaveTextContent("Post 42");
  expect(unmounts).not.toContain("post:42");
  expect(screen.getByTestId("note").props.value).toBe("keep this note");
  await finishAnimation();
  expect(unmounts).toEqual(["post:42"]);
  expect(mounts.filter((id) => id === "list")).toHaveLength(1);
  expect(activeClocks()).toBe(0);
});

test("replace cleans up its outgoing route after the transition", async () => {
  start("/posts/42");
  layoutViews();
  await act(async () => router.replace("/posts/43"));
  layoutViews();
  expect(unmounts).toEqual([]);
  expect(
    screen.getByTestId("post-42", { includeHiddenElements: true }),
  ).toHaveTextContent("Post 42");
  await finishAnimation();
  expect(unmounts).toEqual(["post:42"]);
  expect(screen.getByTestId("post-43")).toBeTruthy();
});

test("cold deep links do not invent outgoing screens or start a clock", () => {
  start("/posts/42");
  layoutViews();
  expect(mounts).toEqual(["post:42"]);
  expect(activeClocks()).toBe(0);
});

test("a screen that never lays out cannot retain an outgoing screen indefinitely", async () => {
  start("/posts/42");
  await act(async () => router.replace("/posts/43"));
  expect(unmounts).toEqual([]);
  await act(async () => {
    jest.advanceTimersByTime(15000);
  });
  expect(unmounts).toEqual(["post:42"]);
  expect(screen.getByTestId("post-43")).toBeTruthy();
});

test("rapid replacements release obsolete screens and stale completion cannot remove the latest route", async () => {
  start("/posts/42");
  layoutViews();
  await act(async () => router.replace("/posts/43"));
  layoutViews();
  act(() => advanceFrames(50));
  await act(async () => router.replace("/posts/44"));
  layoutViews();
  expect(unmounts).toContain("post:42");
  expect(unmounts).not.toContain("post:43");
  await finishAnimation();
  expect(unmounts).toEqual(["post:42", "post:43"]);
  expect(screen.getByTestId("post-44")).toBeTruthy();
  expect(activeClocks()).toBe(0);
});

test("reduced motion settles immediately and cleans up without waiting for layout", async () => {
  function ReducedLayout() {
    return (
      <Ssgoi config={config} reducedMotion="always">
        <SsgoiRouteBoundary />
      </Ssgoi>
    );
  }
  renderRouter(
    { _layout: ReducedLayout, "posts/[id]": Post },
    { initialUrl: "/posts/42" },
  );
  await act(async () => router.replace("/posts/43"));
  expect(unmounts).toEqual(["post:42"]);
  expect(activeClocks()).toBe(0);
});

test("routeKey is scoped to the native route instance", async () => {
  function StableLayout() {
    return (
      <Ssgoi config={config} reducedMotion="never">
        <SsgoiRouteBoundary
          routeKey="shell"
          resolve={({ pathname }) => ({ id: pathname, key: "content" })}
        />
      </Ssgoi>
    );
  }
  renderRouter(
    { _layout: StableLayout, "posts/[id]": Post },
    { initialUrl: "/posts/42" },
  );
  layoutViews();
  await act(async () => router.push("/posts/43"));
  layoutViews();
  expect(mounts).toEqual(["post:42", "post:43"]);
  expect(
    screen.getByTestId("post-42", { includeHiddenElements: true }),
  ).toHaveTextContent("Post 42");
  await finishAnimation();
  await act(async () => router.back());
  layoutViews();
  await finishAnimation();
  expect(mounts).toEqual(["post:42", "post:43"]);
  expect(unmounts).toEqual(["post:43"]);
});

test("preparation errors report once and still reveal the latest screen", async () => {
  const onError = jest.fn();
  const broken = {
    transitions: [
      {
        on: "/posts/*",
        transition: slide({
          physics: { spring: { stiffness: NaN, damping: 22 } },
        }),
      },
    ],
  };
  function BrokenLayout() {
    return (
      <Ssgoi config={broken} reducedMotion="never" onTransitionError={onError}>
        <SsgoiRouteBoundary />
      </Ssgoi>
    );
  }
  renderRouter(
    { _layout: BrokenLayout, "posts/[id]": Post },
    { initialUrl: "/posts/42" },
  );
  await act(async () => router.replace("/posts/43"));
  expect(onError).toHaveBeenCalledTimes(1);
  expect(onError.mock.calls[0][0].message).toContain("non-finite");
  expect(unmounts).toEqual(["post:42"]);
  expect(screen.getByTestId("post-43")).toBeTruthy();
});

test("disposing the layout stops its clock and releases every screen", async () => {
  const rendered = start("/posts/42");
  layoutViews();
  await act(async () => router.push("/posts/43"));
  layoutViews();
  expect(activeClocks()).toBe(1);
  rendered.unmount();
  expect(activeClocks()).toBe(0);
  expect(unmounts.sort()).toEqual(["post:42", "post:43"]);
});

test("resizing the host settles the transition before changing its coordinate space", async () => {
  start("/posts/42");
  layoutViews();
  await act(async () => router.replace("/posts/43"));
  layoutViews();
  const host = screen
    .UNSAFE_getAllByType(View)
    .find(
      (view) => StyleSheet.flatten(view.props.style)?.overflow === "hidden",
    )!;
  fireEvent(host, "layout", {
    nativeEvent: { layout: { x: 0, y: 0, width: 844, height: 390 } },
  });
  expect(unmounts).toEqual(["post:42"]);
  expect(activeClocks()).toBe(0);
  expect(screen.getByTestId("post-43")).toBeTruthy();
});

test("backgrounding the application releases the outgoing screen", async () => {
  const events = jest.spyOn(AppState, "addEventListener");
  try {
    start("/posts/42");
    layoutViews();
    await act(async () => router.replace("/posts/43"));
    layoutViews();
    act(() => {
      for (const [kind, callback] of [...events.mock.calls])
        if (kind === "change") callback("background");
    });
    expect(unmounts).toEqual(["post:42"]);
    expect(activeClocks()).toBe(0);
  } finally {
    events.mockRestore();
  }
});
