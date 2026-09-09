export type StyleObject = Record<string, number | string>;

/** element names the opaque animation target; it need not be a DOM element. */
export type Pose<TTarget> = {
  element: TTarget;
  value: number;
  velocity: number;
};
export type TimelineFrame<TStyle = StyleObject> = {
  time: number;
  value: number;
  velocity: number;
  style?: TStyle;
};
export type Timeline<TTarget, TStyle = StyleObject> = {
  element: TTarget;
  frames: TimelineFrame<TStyle>[];
};

/** A route instance and its platform-owned rendering target. Paths are matching data only. */
export type TransitionView<TTarget, TPayload = unknown> = {
  key: string;
  path: string | null;
  target: TTarget;
  value: TPayload;
};
