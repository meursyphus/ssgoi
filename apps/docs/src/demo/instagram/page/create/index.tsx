"use client";

import { useEffect, useState } from "react";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
import { usePost, type PostSimple } from "@/demo/instagram/state/post";
import { CreateHeader } from "./header";
import { CreatePreview } from "./preview";
import { CreateGallery } from "./gallery";
import { CreateModeSwitch, type CreateMode } from "./mode-switch";

export default function CreatePage() {
  const post = usePost((state) => ({
    posts: state.posts,
    actions: state.actions,
  }));
  useEffect(() => {
    post.actions.loadPosts();
  }, [post.actions]);
  const [picked, setPicked] = useState<PostSimple | null>(null);
  const [mode, setMode] = useState<CreateMode>("post");
  const selected = picked ?? post.posts.data[0] ?? null;
  return (
    <SsgoiRouteBoundary className="relative block min-h-full w-full bg-black text-white">
      <CreateHeader mode={mode} />
      <CreatePreview image={selected?.image} picked={picked !== null} />
      <CreateGallery
        posts={post.posts.data}
        loading={post.posts.isLoading && post.posts.data.length === 0}
        selectedId={selected?.id}
        onSelect={setPicked}
      />
      <CreateModeSwitch mode={mode} onChange={setMode} />
    </SsgoiRouteBoundary>
  );
}
