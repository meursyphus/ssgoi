import Pinterest from '@/components/demo/pinterest'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gallery Demo - SSGOI",
  description: "Experience Pinterest-style expand animations and smooth gallery transitions.",
}

export default async function Page() {
    return <Pinterest />
}