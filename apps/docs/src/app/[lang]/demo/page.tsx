import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Demo - SSGOI",
  description: "Experience beautiful page transitions with SSGOI. Interactive demo showcasing smooth animations and native app-like transitions for modern web applications.",
  openGraph: {
    title: "SSGOI Demo - Beautiful Page Transitions",
    description: "Try out SSGOI's smooth page transitions with our interactive demo. See hero animations, slide effects, and more.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SSGOI Demo - Beautiful Page Transitions",
    description: "Try out SSGOI's smooth page transitions with our interactive demo. See hero animations, slide effects, and more.",
    images: ["/og.png"],
  },
}

export default async function Page ({params}: {params: {lang: string}}) {
    const _p = await params
    const lang = _p.lang
    redirect(`/${lang}/demo/posts`)
}