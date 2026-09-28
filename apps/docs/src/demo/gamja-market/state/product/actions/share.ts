import { action } from "comwit";
import { toast } from "sonner";
import { product } from "../model";
import type { ProductActions } from "../types";

/** Copy for contexts where the async Clipboard API is refused (unfocused frame). */
function copyWithSelection(text: string): boolean {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "absolute";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    field.remove();
  }
}

export const shareActions = action<Pick<ProductActions, "share">>(
  ({ state }) => {
    class ShareActions {
      private model = state(product);

      async share() {
        const url = window.location.href;
        const title = this.model.currentProduct?.name ?? "감자마켓";
        // The OS share sheet when there is one (it rejects inside iframes
        // without allow="web-share"); otherwise copy the link.
        if (typeof navigator.share === "function") {
          try {
            await navigator.share({ title, url });
            return;
          } catch (e) {
            if (e instanceof DOMException && e.name === "AbortError") return;
          }
        }
        let copied = false;
        try {
          await navigator.clipboard.writeText(url);
          copied = true;
        } catch {
          copied = copyWithSelection(url);
        }
        if (copied) toast.success("링크를 복사했어요");
        else toast("공유 링크", { description: url });
      }
    }
    return new ShareActions();
  },
);
