import type { parse } from "svelte/compiler";
export type Root = ModernParseReturnType<typeof parse>;
export type Fragment = Root["fragment"];
export type SvelteOptions = Root["options"];
export type Script = Root["instance"];
type FragmentChild = Fragment["nodes"][number];
export type Text = Extract<FragmentChild, {
    type: "Text";
}>;
export type ExpressionTag = Extract<FragmentChild, {
    type: "ExpressionTag";
}>;
export type HtmlTag = Extract<FragmentChild, {
    type: "HtmlTag";
}>;
export type ConstTag = Extract<FragmentChild, {
    type: "ConstTag";
}>;
export type DebugTag = Extract<FragmentChild, {
    type: "DebugTag";
}>;
export type RenderTag = Extract<FragmentChild, {
    type: "RenderTag";
}>;
export type Component = Extract<FragmentChild, {
    type: "Component";
}>;
export type TitleElement = Extract<FragmentChild, {
    type: "TitleElement";
}>;
export type SlotElement = Extract<FragmentChild, {
    type: "SlotElement";
}>;
export type RegularElement = Extract<FragmentChild, {
    type: "RegularElement";
}>;
export type SvelteBody = Extract<FragmentChild, {
    type: "SvelteBody";
}>;
export type SvelteComponent = Extract<FragmentChild, {
    type: "SvelteComponent";
}>;
export type SvelteDocument = Extract<FragmentChild, {
    type: "SvelteDocument";
}>;
export type SvelteElement = Extract<FragmentChild, {
    type: "SvelteElement";
}>;
export type SvelteFragment = Extract<FragmentChild, {
    type: "SvelteFragment";
}>;
export type SvelteHead = Extract<FragmentChild, {
    type: "SvelteHead";
}>;
export type SvelteOptionsRaw = Extract<FragmentChild, {
    type: "SvelteOptions";
}>;
export type SvelteSelf = Extract<FragmentChild, {
    type: "SvelteSelf";
}>;
export type SvelteWindow = Extract<FragmentChild, {
    type: "SvelteWindow";
}>;
export type IfBlock = Extract<FragmentChild, {
    type: "IfBlock";
}>;
export type EachBlock = Extract<FragmentChild, {
    type: "EachBlock";
}>;
export type AwaitBlock = Extract<FragmentChild, {
    type: "AwaitBlock";
}>;
export type KeyBlock = Extract<FragmentChild, {
    type: "KeyBlock";
}>;
export type SnippetBlock = Extract<FragmentChild, {
    type: "SnippetBlock";
}>;
export type Comment = Extract<FragmentChild, {
    type: "Comment";
}>;
type ComponentAttribute = Component["attributes"][number];
export type Attribute = Extract<ComponentAttribute, {
    type: "Attribute";
}>;
export type SpreadAttribute = Extract<ComponentAttribute, {
    type: "SpreadAttribute";
}>;
export type AnimateDirective = Extract<ComponentAttribute, {
    type: "AnimateDirective";
}>;
export type BindDirective = Extract<ComponentAttribute, {
    type: "BindDirective";
}>;
export type ClassDirective = Extract<ComponentAttribute, {
    type: "ClassDirective";
}>;
export type LetDirective = Extract<ComponentAttribute, {
    type: "LetDirective";
}>;
export type OnDirective = Extract<ComponentAttribute, {
    type: "OnDirective";
}>;
export type StyleDirective = Extract<ComponentAttribute, {
    type: "StyleDirective";
}>;
export type TransitionDirective = Extract<ComponentAttribute, {
    type: "TransitionDirective";
}>;
export type UseDirective = Extract<ComponentAttribute, {
    type: "UseDirective";
}>;
export type Tag = ExpressionTag | HtmlTag | ConstTag | DebugTag | RenderTag;
export type ElementLike = Component | TitleElement | SlotElement | RegularElement | SvelteBody | SvelteComponent | SvelteDocument | SvelteElement | SvelteFragment | SvelteHead | SvelteOptionsRaw | SvelteSelf | SvelteWindow;
export type Block = EachBlock | IfBlock | AwaitBlock | KeyBlock | SnippetBlock;
export type Directive = AnimateDirective | BindDirective | ClassDirective | LetDirective | OnDirective | StyleDirective | TransitionDirective | UseDirective;
type ModernParseReturnType<T> = T extends {
    (source: string, options: {
        filename?: string;
        modern: true;
    }): infer R;
    (...args: any[]): any;
} ? R : any;
export {};
