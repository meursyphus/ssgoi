'use client'

import Giscus from '@giscus/react'
import { getGiscusLanguage } from '@/lib/giscus-utils'
import { SupportedLanguage } from '@/i18n/supported-languages'

interface GiscusCommentsProps {
  slug: string // Use slug as the unique identifier
  lang: SupportedLanguage
}

export default function GiscusComments({ slug, lang }: GiscusCommentsProps) {

  return (
    <div className="mt-16 pt-8 border-t border-gray-700">
      <Giscus
        id="comments"
        repo="meursyphus/ssgoi"
        repoId="R_kgDOKuibEw"
        category="Blog Comments"
        categoryId="DIC_kwDOKuibE84CuuUh"
        mapping="specific"
        term={`blog-post-${slug}`} // Use slug as unique identifier across languages
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="dark"
        lang={getGiscusLanguage(lang)}
        loading="lazy"
      />
    </div>
  )
}