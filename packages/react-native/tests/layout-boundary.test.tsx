import { useEffect } from "react";
import { Text, View } from "react-native";
import { render } from "@testing-library/react-native";
import { createStandardNavigator } from "standard-navigation";
import {
  StackRouter,
  router,
  unstable_integrateWithRouter,
  useLocalSearchParams,
} from "expo-router";
import {
  act,
  renderRouter,
  screen,
  fireEvent,
  cleanup,
} from "expo-router/testing-library";
import { Ssgoi } from "../src/ssgoi";
import {
  SsgoiLayoutBoundary,
  type SsgoiFramework,
  type SsgoiLayoutBoundaryProps,
} from "../src";
import { NativeNavigator } from "../src/navigator";
import { slide } from "../src/view-transitions";
import { activeClocks, advanceFrames } from "./frame-clock";

const config = { transitions: [{ on: "/posts/*", transition: slide() }] };
function fakeFramework() {
  const StackRouter = () => ({});
  const rendered: SsgoiLayoutBoundaryProps[] = [];
  const unstable_integrateWithRouter = jest.fn(() => {
    return function Boundary(props: SsgoiLayoutBoundaryProps) {
      rendered.push(props);
      return <Text>boundary</Text>;
    };
  });
  return { StackRouter, unstable_integrateWithRouter, rendered };
}
function silenceErrors() {
  return jest.spyOn(console, "error").mockImplementation(() => {});
}
afterEach(() => {
  cleanup();
  jest.useRealTimers();
});

test("integrates the native navigator once per set of primitives and passes props through", () => {
  const fake = fakeFramework();
  const boundary = ({ pathname }: { pathname: string }) => ({
    id: pathname,
    key: "shell",
  });
  const app = (initialRouteName: string) => (
    // A fresh framework object every render must not rebuild the navigator.
    <Ssgoi
      config={config}
      reducedMotion="never"
      framework={{
        StackRouter: fake.StackRouter,
        unstable_integrateWithRouter: fake.unstable_integrateWithRouter,
      }}
    >
      <SsgoiLayoutBoundary
        initialRouteName={initialRouteName}
        boundary={boundary}
      />
    </Ssgoi>
  );
  const rendered = render(app("index"));
  rendered.rerender(app("posts"));
  expect(fake.unstable_integrateWithRouter).toHaveBeenCalledTimes(1);
  expect(fake.unstable_integrateWithRouter).toHaveBeenCalledWith(
    // The inlined navigator must stay identical to standard-navigation's own output.
    createStandardNavigator(NativeNavigator),
    fake.StackRouter,
    { useOnlyUserDefinedScreens: false },
  );
  expect(fake.rendered.map((props) => props.initialRouteName)).toEqual([
    "index",
    "posts",
  ]);
  expect(fake.rendered[1]).toMatchObject({ boundary });

  const other = {
    StackRouter: () => ({}),
    unstable_integrateWithRouter: fake.unstable_integrateWithRouter,
  };
  render(
    <Ssgoi config={config} reducedMotion="never" framework={other}>
      <SsgoiLayoutBoundary />
    </Ssgoi>,
  );
  expect(fake.unstable_integrateWithRouter).toHaveBeenCalledTimes(2);
});

test("throws a setup error when <Ssgoi> has no framework", () => {
  const errors = silenceErrors();
  try {
    expect(() =>
      render(
        <Ssgoi config={config} reducedMotion="never">
          <SsgoiLayoutBoundary />
        </Ssgoi>,
      ),
    ).toThrow(
      "SSGOI: SsgoiLayoutBoundary requires a framework. Pass it to <Ssgoi framework={{ StackRouter, unstable_integrateWithRouter }}>",
    );
  } finally {
    errors.mockRestore();
  }
});

test("rejects an Expo Router without the standard navigator API", () => {
  const errors = silenceErrors();
  const framework = {
    StackRouter: () => ({}),
    unstable_integrateWithRouter: undefined,
  } as unknown as SsgoiFramework;
  try {
    expect(() =>
      render(
        <Ssgoi config={config} reducedMotion="never" framework={framework}>
          <SsgoiLayoutBoundary />
        </Ssgoi>,
      ),
    ).toThrow(
      "SSGOI: SsgoiLayoutBoundary requires Expo Router's standard navigator API",
    );
  } finally {
    errors.mockRestore();
  }
});

const mounts: string[] = [];
const unmounts: string[] = [];
const expo: SsgoiFramework = { StackRouter, unstable_integrateWithRouter };
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
function start(boundary?: SsgoiLayoutBoundaryProps["boundary"]) {
  function Layout() {
    return (
      <Ssgoi config={config} reducedMotion="never" framework={expo}>
        <SsgoiLayoutBoundary boundary={boundary} />
      </Ssgoi>
    );
  }
  renderRouter(
    { _layout: Layout, "posts/[id]": Post },
    { initialUrl: "/posts/42" },
  );
}
function layoutViews() {
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

test("drives file-discovered Expo routes through the injected framework", async () => {
  start();
  layoutViews();
  await act(async () => router.push("/posts/43"));
  layoutViews();
  expect(mounts).toEqual(["post:42", "post:43"]);
  expect(activeClocks()).toBe(1);
  await finishAnimation();
  await act(async () => router.back());
  layoutViews();
  // The popped route keeps its React instance until playback completes.
  expect(
    screen.getByTestId("post-43", { includeHiddenElements: true }),
  ).toHaveTextContent("Post 43");
  expect(unmounts).toEqual([]);
  await finishAnimation();
  expect(unmounts).toEqual(["post:43"]);
  expect(activeClocks()).toBe(0);
});

test("a fixed boundary key is scoped to the native route instance", async () => {
  start("shell");
  layoutViews();
  await act(async () => router.push("/posts/43"));
  layoutViews();
  expect(mounts).toEqual(["post:42", "post:43"]);
  await finishAnimation();
  await act(async () => router.back());
  layoutViews();
  await finishAnimation();
  expect(mounts).toEqual(["post:42", "post:43"]);
  expect(unmounts).toEqual(["post:43"]);
});

test("a fixed boundary id replaces the route pathname for matching", async () => {
  // Both screens resolve to /feed, which no rule matches, so replace settles at once.
  start({ id: "/feed" });
  layoutViews();
  await act(async () => router.replace("/posts/43"));
  expect(unmounts).toEqual(["post:42"]);
  expect(activeClocks()).toBe(0);
});

test("a computed boundary must return an absolute id", () => {
  const errors = silenceErrors();
  try {
    expect(() => start(() => ({ id: "posts" }))).toThrow(
      "SSGOI: boundary must return an absolute route id such as /posts/42.",
    );
  } finally {
    errors.mockRestore();
  }
});
