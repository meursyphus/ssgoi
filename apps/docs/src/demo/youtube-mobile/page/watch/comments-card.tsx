"use client";

import { commentsFor, type MockVideo } from "../../mock-data";
import { openActionSheet } from "../shared/action-sheet";
import { CommentList } from "../shared/comment-list";

/** Comments teaser; tapping it opens the thread in the bottom sheet. */
export function CommentsCard({ video }: { video: MockVideo }) {
  const comments = commentsFor(video.id);
  const [first] = comments;
  const title = video.live ? "Live chat" : "Comments";

  return (
    <button
      type="button"
      onClick={() =>
        openActionSheet({
          title: video.live ? title : `${title} ${video.comments}`,
          content: <CommentList comments={comments} />,
        })
      }
      className="mx-3 mt-4 block w-[calc(100%-24px)] rounded-xl bg-neutral-100 p-3 text-left active:bg-neutral-200"
    >
      <p className="text-[14px] font-semibold">
        {title}{" "}
        {!video.live && (
          <span className="font-normal text-neutral-500">{video.comments}</span>
        )}
      </p>
      <p className="mt-2 line-clamp-2 text-[13px] leading-[18px] text-neutral-800">
        <span className="font-medium text-neutral-500">{first.author}</span>{" "}
        {first.text}
      </p>
    </button>
  );
}
