import Posts from '@/components/demo/posts'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Posts Demo - SSGOI",
  description: "Experience smooth slide transitions with parallax effects in our posts demo.",
}

export default async function Page() {
    return <Posts />
}