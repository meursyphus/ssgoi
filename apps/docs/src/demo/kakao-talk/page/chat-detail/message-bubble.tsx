import { Link } from "@/lib/link";
import type { ChatMessage } from "@/demo/kakao-talk/api/chat";

type Props = {
  message: ChatMessage;
  threadId: string;
};

export function MessageBubble({ message, threadId }: Props) {
  if (message.senderId === "system") {
    return (
      <p className="mx-auto max-w-[85%] rounded-full bg-black/10 px-3 py-1 text-center text-[11px] leading-snug text-neutral-700">
        {message.text}
      </p>
    );
  }

  const isMe = message.senderId === "me";
  const photo = message.imageUrl ? (
    <PhotoLink message={message} threadId={threadId} />
  ) : null;

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
          {photo}
          <p className="whitespace-pre-line">{message.text}</p>
        </div>
      </div>
    );
  }

  // 보낸 사람 아바타·이름 → 그 친구의 프로필 시트. room을 넘겨서 프로필의
  // '1:1 채팅'이 같은 방이면 새로 쌓지 않고 되돌아온다.
  const profileHref = `/demo/kakao-talk/profile/${message.senderId}?room=${threadId}`;

  return (
    <div className="flex w-full items-start gap-2">
      <div className="w-8 flex-shrink-0">
        {message.showSenderInfo && message.senderAvatar && (
          <Link
            href={profileHref}
            scroll={false}
            aria-label={`${message.senderName ?? ""} 프로필`}
            className="block active:opacity-70"
          >
            <img
              src={message.senderAvatar}
              alt={message.senderName ?? ""}
              className="h-8 w-8 rounded-2xl bg-neutral-200 object-cover"
            />
          </Link>
        )}
      </div>
      <div className="flex max-w-[72%] flex-col items-start gap-0.5">
        {message.showSenderInfo && message.senderName && (
          <Link
            href={profileHref}
            scroll={false}
            tabIndex={-1}
            className="px-1 text-[12px] text-neutral-700"
          >
            {message.senderName}
          </Link>
        )}
        <div className="flex items-end gap-1.5">
          <div className="rounded-2xl rounded-tl-md bg-white px-3 py-2 text-[14px] leading-snug text-neutral-900">
            {photo}
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

/** 사진 메시지 → 전체화면 뷰어 (hero: 말풍선 사진이 그대로 커진다) */
function PhotoLink({ message, threadId }: Props) {
  return (
    <Link
      href={`/demo/kakao-talk/chats/${threadId}/photo/${message.id}`}
      scroll={false}
      aria-label="사진 크게 보기"
      className="mb-1 block overflow-hidden rounded-md"
    >
      <img
        src={message.imageUrl}
        alt=""
        width={400}
        height={300}
        data-hero-exit-key={message.id}
        className="max-h-48 w-full object-cover"
      />
    </Link>
  );
}
