import { redirect } from "next/navigation"


export default async function Page ({params}: {params: {lang: string}}) {
    const _p = await params
    const lang = _p.lang
    redirect(`/${lang}/demo/posts`)
}