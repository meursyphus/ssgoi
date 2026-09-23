import type { Animation } from "../animation/animation";
import type {
  AnimationFactoryArgs,
  PrepareArgs,
  SsgoiTransitionContext,
  TransitionConfig,
} from "@types";

/** Preparation and construction always belong to the same selected direction. */
export interface TransitionDirection<
  Prepared extends object = object,
  Result extends Animation = Animation,
> {
  prepare?: (args: PrepareArgs) => Prepared | Promise<Prepared>;
  animation: (args: AnimationFactoryArgs<Prepared>) => Result;
}

export interface TransitionDefinition<
  ForwardPrepared extends object = object,
  Forward extends Animation = Animation,
  BackwardPrepared extends object = object,
  Backward extends Animation = Animation,
> {
  forward: TransitionDirection<ForwardPrepared, Forward>;
  backward: TransitionDirection<BackwardPrepared, Backward>;
}

export interface OverrideArgs<Result extends Animation> {
  animation: Result;
  /** Original context and authoritative direction supplied by the core. */
  context: SsgoiTransitionContext;
}

export type OverrideFn<Result extends Animation = Animation> = (
  args: OverrideArgs<Result>,
) => void;

export interface Override<
  Forward extends Animation = Animation,
  Backward extends Animation = Forward,
> {
  forward?: OverrideFn<Forward>;
  backward?: OverrideFn<Backward>;
}

export type PresetExtras<T extends Transition = Transition> =
  T extends Transition<infer Forward, infer Backward>
    ? { override?: Override<Forward, Backward> }
    : never;

// These symbols are implementation details. Each returned transition is a
// dispatcher-compatible definition, not a mutable per-navigation controller.
const DEFINITION = Symbol("ssgoi.transition.definition");
const PREPARED_RUN = Symbol("ssgoi.transition.prepared-run");

interface Run<Result extends Animation> {
  context: SsgoiTransitionContext;
  prepare: (args: PrepareArgs) => object | Promise<object>;
  animation: (args: AnimationFactoryArgs<object>) => Result;
}

interface Metadata<Forward extends Animation, Backward extends Animation> {
  forward: (context: SsgoiTransitionContext) => Run<Forward>;
  backward: (context: SsgoiTransitionContext) => Run<Backward>;
}

/**
 * A transition accepted by the core dispatcher. Its generic parameters retain
 * each factory's concrete return type for preset overrides and custom tools.
 */
export interface Transition<
  Forward extends Animation = Animation,
  Backward extends Animation = Forward,
> extends TransitionConfig<object, Forward | Backward> {
  readonly [DEFINITION]: Metadata<Forward, Backward>;
}

function bindDirection<Prepared extends object, Result extends Animation>(
  branch: TransitionDirection<Prepared, Result>,
  context: SsgoiTransitionContext,
): Run<Result> {
  return {
    context,
    prepare: (args) => branch.prepare?.({ ...args, context }) ?? {},
    // Prepared values are opaque to the dispatcher and passed back verbatim.
    // The selected branch is captured in this run, so forward's prepared data
    // cannot reach backward's factory even when preparations overlap.
    animation: (args) =>
      branch.animation({ ...args, context } as AnimationFactoryArgs<Prepared>),
  };
}

function createTransition<
  Forward extends Animation,
  Backward extends Animation,
>(metadata: Metadata<Forward, Backward>): Transition<Forward, Backward> {
  return {
    [DEFINITION]: metadata,
    prepare(args) {
      const prepareRun = (run: Run<Forward | Backward>) => {
        const prepared = run.prepare(args);
        const capture = (data: object) => ({ ...data, [PREPARED_RUN]: run });
        // Keep synchronous prepare calls synchronous. In particular, their
        // from/to.then callbacks still stage styles before outgoing insertion.
        return typeof (prepared as Promise<object>).then === "function"
          ? Promise.resolve(prepared).then(capture)
          : capture(prepared);
      };
      // Core direction is final. Transitions only select its matching lifecycle.
      return prepareRun(metadata[args.context.direction](args.context));
    },
    animation(args) {
      const prepared = args as AnimationFactoryArgs<object> & {
        [PREPARED_RUN]?: Run<Forward | Backward>;
      };
      // Direct callers without prepare still select a direction consistently.
      // Prepared dispatches use the captured run; never resolve a second time.
      const run =
        prepared[PREPARED_RUN] ??
        metadata[args.context.direction](args.context);
      return run.animation(args);
    },
  };
}

/**
 * Define a custom transition with independent preparation and concrete return
 * inference for each direction. The core receives only the Animation contract.
 */
export function defineTransition<
  ForwardPrepared extends object,
  Forward extends Animation,
  BackwardPrepared extends object,
  Backward extends Animation,
>(
  definition: TransitionDefinition<
    ForwardPrepared,
    Forward,
    BackwardPrepared,
    Backward
  >,
  extras: { override?: Override<NoInfer<Forward>, NoInfer<Backward>> } = {},
): Transition<Forward, Backward> {
  const metadata: Metadata<Forward, Backward> = {
    forward: (context) => bindDirection(definition.forward, context),
    backward: (context) => bindDirection(definition.backward, context),
  };
  return withOverride(createTransition(metadata), extras.override);
}

/** Retune a defined transition without mutating its reusable definition. */
export function withOverride<
  Forward extends Animation,
  Backward extends Animation,
>(
  transition: Transition<Forward, Backward>,
  override: Override<NoInfer<Forward>, NoInfer<Backward>> | undefined,
): Transition<Forward, Backward> {
  if (!override) return transition;
  const metadata = transition[DEFINITION];
  const apply = <Result extends Animation>(
    run: Run<Result>,
    callback: OverrideFn<Result> | undefined,
  ): Run<Result> => ({
    ...run,
    animation(args) {
      const animation = run.animation(args);
      callback?.({
        animation,
        context: run.context,
      });
      return animation;
    },
  });
  return createTransition({
    forward: (context) => apply(metadata.forward(context), override.forward),
    backward: (context) => apply(metadata.backward(context), override.backward),
  });
}
