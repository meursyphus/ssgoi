import FeedDetail from "@/components/profile/feed-detail";

interface ProfilePostPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePostPage({ params }: ProfilePostPageProps) {
  const { id } = await params;
  return <FeedDetail postId={id} />;
}
