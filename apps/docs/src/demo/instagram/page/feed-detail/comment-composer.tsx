"use client";

export function CommentComposer({ avatar }: { avatar?: string }) {
  return (
    <div className="mt-3 flex items-center gap-2 border-t border-neutral-200 px-3 py-3">
      <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-neutral-100">
        {avatar && (
          <img src={avatar} alt="me" className="h-full w-full object-cover" />
        )}
      </div>
      <input
        type="text"
        placeholder="댓글 달기..."
        className="flex-1 bg-transparent text-[13px] outline-none placeholder-neutral-400"
      />
      <span className="text-[18px] leading-none">🥰</span>
      <span className="text-[18px] leading-none">🙌</span>
    </div>
  );
}
