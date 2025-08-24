import { getServerTranslations } from "@/i18n/get-server-translations";

export async function BlogListStructuredData({
  posts,
  lang,
}: {
  posts: Array<{
    slug: string;
    title: string;
    description?: string;
    date?: string;
    author?: string;
    thumbnail?: string;
  }>;
  lang: string;
}) {
  const t = await getServerTranslations("blogStructuredData", lang);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: t("name"),
    description: t("description"),
    url: `https://ssgoi.dev/${lang}/blog`,
    inLanguage: lang,
    publisher: {
      "@type": "Organization",
      name: "SSGOI",
      logo: {
        "@type": "ImageObject",
        url: "https://ssgoi.dev/og.png",
      },
    },
    blogPost: posts.map(post => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `https://ssgoi.dev/${lang}/blog/${post.slug}`,
      datePublished: post.date,
      author: {
        "@type": "Person",
        name: post.author || "MeurSyphus",
      },
      image: post.thumbnail,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export async function BlogPostStructuredData({
  post,
  relatedPosts,
  lang,
}: {
  post: {
    slug: string;
    title: string;
    description?: string;
    date?: string;
    author?: string;
    thumbnail?: string;
    tags?: string[];
  };
  relatedPosts?: Array<{
    slug: string;
    title: string;
    description?: string;
    date?: string;
    thumbnail?: string;
  }>;
  lang: string;
}) {
  const t = await getServerTranslations("blogStructuredData", lang);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || `Read about ${post.title} on ${t("name")}`,
    url: `https://ssgoi.dev/${lang}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author || "MeurSyphus",
    },
    publisher: {
      "@type": "Organization",
      name: "SSGOI",
      logo: {
        "@type": "ImageObject",
        url: "https://ssgoi.dev/og.png",
      },
    },
    image: post.thumbnail ? {
      "@type": "ImageObject",
      url: post.thumbnail,
    } : undefined,
    keywords: post.tags?.join(", "),
    inLanguage: lang,
    isPartOf: {
      "@type": "Blog",
      name: t("name"),
      url: `https://ssgoi.dev/${lang}/blog`,
    },
  };

  // Add related articles if available
  const relatedArticles = relatedPosts?.length ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Related Articles",
    itemListElement: relatedPosts.map((relatedPost, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "BlogPosting",
        headline: relatedPost.title,
        description: relatedPost.description,
        url: `https://ssgoi.dev/${lang}/blog/${relatedPost.slug}`,
        datePublished: relatedPost.date,
        image: relatedPost.thumbnail
      }
    }))
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {relatedArticles && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedArticles) }}
        />
      )}
    </>
  );
}