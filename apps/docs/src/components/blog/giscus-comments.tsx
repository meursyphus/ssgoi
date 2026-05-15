"use client";

import Giscus from "@giscus/react";
import { getGiscusLanguage } from "@/lib/giscus-utils";

interface GiscusCommentsProps {
  slug: string; // Use slug as the unique identifier
}

export default function GiscusComments({ slug }: GiscusCommentsProps) {
  return (
    <div className="mt-16 pt-6 border-t border-white/5">
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
        lang={getGiscusLanguage()}
        loading="lazy"
      />
    </div>
  );
}
