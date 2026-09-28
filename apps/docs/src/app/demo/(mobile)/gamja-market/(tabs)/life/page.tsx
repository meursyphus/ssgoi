import { post } from "@/demo/gamja-market/api/post";
import LifePage from "@/demo/gamja-market/page/life";

export default async function Page() {
  const posts = await post.findAll();
  return <LifePage posts={posts} />;
}
