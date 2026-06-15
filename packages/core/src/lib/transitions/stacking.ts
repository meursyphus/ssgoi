/**
 * Non-negative stacking tiers shared by the page transitions.
 *
 * During a page transition the outgoing `from` page is taken out of flow
 * (`position: absolute`, applied by the context) while the incoming `to` page
 * stays in normal flow. A *positioned* element with `z-index: auto`/`0` always
 * paints **above** in-flow content, so simply lowering `from`'s z-index to `0`
 * does NOT put it beneath `to`. To control which page sits on top we instead:
 *
 *   1. give the BACKGROUND page an explicit `z-index` (`Z_BACKGROUND`) so it
 *      forms its own stacking context and its positioned descendants stay
 *      trapped beneath the foreground, and
 *   2. give the FOREGROUND page a higher `z-index` (`Z_FOREGROUND`),
 *      promoting it to `position: relative` when it is the still-in-flow `to`
 *      so the index actually takes effect.
 *
 * Every tier is `>= 0` on purpose. A negative z-index escapes upward to the
 * nearest ancestor stacking context, so it bleeds *behind* the page wrapper
 * whenever the caller has not given that wrapper its own stacking context
 * (`isolation: isolate` / `z-index: 0`). Keeping the whole scheme non-negative
 * removes that caller requirement entirely.
 *
 * NOTE: because the foreground is now expressed by raising the *surviving*
 * `to` node (not by pushing the disposable `from` clone), every transition that
 * uses these tiers MUST restore `to`'s `zIndex`/`position` on settle — in
 * unmount mode the context provides no cleanup for the persistent `to` node.
 */
export const Z_BACKGROUND = "0";
export const Z_OVERLAY = "1";
export const Z_FOREGROUND = "2";
