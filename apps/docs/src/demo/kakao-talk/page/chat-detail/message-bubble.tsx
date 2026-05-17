import type { ChatMessage } from "@/demo/kakao-talk/api/chat";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isMe = message.senderId === "me";

  if (isMe) {
    return (
      <div className="flex w-full items-end justify-end gap-1.5">
        <div className="mb-0.5 flex flex-col items-end gap-0.5">
          {message.readIndicator && (
            <span className="text-[10px] font-semibold text-[#F5C100]">
              {message.readIndicator}
            </span>
          )}
          <span className="text-[10px] text-neutral-600">{message.sentAt}</span>
        </div>
        <div className="max-w-[72%] rounded-2xl rounded-tr-md bg-[#FFE56B] px-3 py-2 text-[14px] leading-snug text-neutral-900">
          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt=""
              className="mb-1 max-h-48 w-full rounded-md object-cover"
            />
          )}
          <p className="whitespace-pre-line">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-start gap-2">
      <div className="w-8 flex-shrink-0">
        {message.showSenderInfo && message.senderAvatar && (
          <img
            src={message.senderAvatar}
            alt={message.senderName ?? ""}
            className="h-8 w-8 rounded-2xl bg-neutral-200 object-cover"
          />
        )}
      </div>
      <div className="flex max-w-[72%] flex-col items-start gap-0.5">
        {message.showSenderInfo && message.senderName && (
          <span className="px-1 text-[12px] text-neutral-700">
            {message.senderName}
          </span>
        )}
        <div className="flex items-end gap-1.5">
          <div className="rounded-2xl rounded-tl-md bg-white px-3 py-2 text-[14px] leading-snug text-neutral-900">
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt=""
                className="mb-1 max-h-48 w-full rounded-md object-cover"
              />
            )}
            <p className="whitespace-pre-line">{message.text}</p>
          </div>
          <div className="mb-0.5 flex flex-col items-start gap-0.5">
            {message.readIndicator && (
              <span className="text-[10px] font-semibold text-[#F5C100]">
                {message.readIndicator}
              </span>
            )}
            <span className="text-[10px] text-neutral-600">
              {message.sentAt}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
