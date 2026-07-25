/**
 * Unified effect-only preset configuration. Route matching and navigation
 * direction live in Ssgoi transition rules, not inside a preset.
 */
export type PresetConfig<
  TType extends string = never,
  TVariant extends string = "default",
  TOptions extends object = Record<string, never>,
> = {
  type?: TType;
  variant?: TVariant;
  options?: TOptions;
};
