import Profile from '@/components/demo/profile'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile Demo - SSGOI",
  description: "View user profile with smooth animations and transitions.",
}

export default async function Page() {
    return <Profile />
}