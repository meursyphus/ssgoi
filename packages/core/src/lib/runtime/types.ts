export type NavigationDirection = "forward" | "backward";
export type PathPatterns = string | readonly string[];

/** Policy is expressed in the rule's forward orientation, then mapped to OUT/IN. */
export type PreserveScrollConfig = { from: boolean; to: boolean };
/**
 * `"shared"` gives the rule's pages one scroll position: the incoming page
 * opens where the container already is instead of at its own saved or reset
 * position (profile tabs under one header, for example).
 */
export type PreserveScrollOption = PreserveScrollConfig | "shared";

type RuleBase<T> = {
  transition: T;
  preserveScroll?: PreserveScrollOption;
  /** Higher priority wins before path specificity. Defaults to 0. */
  priority?: number;
};

export type OnRouteRule<T> = RuleBase<T> & {
  on: PathPatterns;
  except?: PathPatterns;
  from?: never;
  to?: never;
  ordered?: never;
  bidirectional?: never;
};

export type PairRouteRule<T> = RuleBase<T> & {
  from: PathPatterns;
  to: PathPatterns;
  bidirectional?: boolean;
  on?: never;
  except?: never;
  ordered?: never;
};

export type OrderedRouteRule<T> = RuleBase<T> & {
  ordered: readonly string[];
  on?: never;
  except?: never;
  from?: never;
  to?: never;
  bidirectional?: never;
};

export type RouteRule<T> =
  | OnRouteRule<T>
  | PairRouteRule<T>
  | OrderedRouteRule<T>;
/** Container width below 768 logical units, rather than an OS check. */
export type TransitionsResolverArgs = { isMobile: boolean };
export type TransitionsFn<T> = (
  args: TransitionsResolverArgs,
) => readonly RouteRule<T>[];
export type TransitionsOption<T> = readonly RouteRule<T>[] | TransitionsFn<T>;
export type RouteConfig<T> = {
  transitions?: TransitionsOption<T>;
  middleware?: (from: string, to: string) => { from: string; to: string };
};
