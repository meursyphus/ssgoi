import PostDetail from "@/components/posts/detail";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  return <PostDetail postId={id} />;
}
