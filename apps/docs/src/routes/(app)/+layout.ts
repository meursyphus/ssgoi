import type { MetaTagsProps } from 'svelte-meta-tags';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ url }) => {
  const baseMetaTags: MetaTagsProps = {
    title: 'SSGOI - Svelte Smooth Go Transition Library',
    description: 'A smooth page transition library for Svelte applications',
    canonical: url.href,
    additionalLinkTags: [
      {
        rel: 'sitemap',
        href: '/sitemap.xml',
      },
      {
        rel: 'robots',
        href: '/robots.txt',
      },
      {
        rel: 'icon',
        href: '/icon.svg',
      },
    ],
    openGraph: {
      type: 'website',
      url: 'https://ssgoi.pages.dev/',
      title: 'SSGOI - Svelte Smooth Go Transition Library',
      description: 'A smooth page transition library for Svelte applications',
      images: [
        {
          url: 'https://ssgoi.pages.dev/main.png',
          alt: 'SSGOI Logo',
        },
      ],
    },
    twitter: {
      cardType: 'summary_large_image',
      site: 'https://ssgoi.pages.dev/',
      title: 'SSGOI - Svelte Smooth Go Transition Library',
      description: 'A smooth page transition library for Svelte applications',
      image: 'https://ssgoi.pages.dev/main.png',
      imageAlt: 'SSGOI Logo',
    },
  };

  return {
    baseMetaTags,
  };
};
