'use client'

import Giscus from '@giscus/react'
import { useEffect, useState } from 'react'

interface GiscusCommentsProps {
  slug: string // Use slug as the unique identifier
  lang: string
}

export default function GiscusComments({ slug, lang }: GiscusCommentsProps) {

  // Map language codes to giscus supported languages
  const getGiscusLang = (lang: string) => {
    const langMap: Record<string, string> = {
      ko: 'ko',
      en: 'en',
      ja: 'ja',
      zh: 'zh-CN',
    }
    return langMap[lang] || 'en'
  }

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
        lang={getGiscusLang(lang)}
        loading="lazy"
      />
    </div>
  )
}