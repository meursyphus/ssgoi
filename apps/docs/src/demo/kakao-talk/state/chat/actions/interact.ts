import { action, OnError } from "comwit";
import { toast } from "sonner";
import { chat as chatAPI } from "@/demo/kakao-talk/api/chat";
import { chat } from "../model";
import type { ChatActions } from "../types";

/** The provider passes the Next router; the picker replaces its own entry. */
type RouterContext = {
  router: { replace: (href: string, options?: { scroll?: boolean }) => void };
};

const showError = (e: unknown) => {
  toast.error(e instanceof Error ? e.message : "잠시 후 다시 시도해 주세요");
};

export const interactActions = action<
  Pick<ChatActions, "send" | "openRoomWith">,
  RouterContext
>(({ state, context }) => {
  class InteractActions {
    private model = state(chat);

    @OnError(showError)
    async send(text: string) {
      const thread = this.model.currentThread;
      if (!thread || !text.trim()) return;
      const message = await chatAPI.sendMessage(thread.id, text);
      thread.messages.push(message);
    }

    @OnError(showError)
    async openRoomWith(friendIds: string[]) {
      if (friendIds.length === 0) {
        toast("대화상대를 선택해 주세요");
        return;
      }
      const id = await chatAPI.findRoomWith(friendIds);
      context.router.replace(`/demo/kakao-talk/chats/${id}`, { scroll: false });
    }
  }
  return new InteractActions();
});
