import { messages } from "@/messages";

export async function BlogListStructuredData({
  posts,
}: {
  posts: Array<{
    slug: string;
    title: string;
    description?: string;
    date?: string;
    author?: string;
    thumbnail?: string;
  }>;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: messages.blogStructuredData.name,
    description: messages.blogStructuredData.description,
    url: `https://ssgoi.dev/blog`,
    publisher: {
      "@type": "Organization",
      name: "SSGOI",
      logo: {
        "@type": "ImageObject",
        url: "https://ssgoi.dev/og.png",
      },
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `https://ssgoi.dev/blog/${post.slug}`,
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
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description:
      post.description ||
      `Read about ${post.title} on ${messages.blogStructuredData.name}`,
    url: `https://ssgoi.dev/blog/${post.slug}`,
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
    image: post.thumbnail
      ? {
          "@type": "ImageObject",
          url: post.thumbnail,
        }
      : undefined,
    keywords: post.tags?.join(", "),
    isPartOf: {
      "@type": "Blog",
      name: messages.blogStructuredData.name,
      url: `https://ssgoi.dev/blog`,
    },
  };

  // Add related articles if available
  const relatedArticles = relatedPosts?.length
    ? {
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
            url: `https://ssgoi.dev/blog/${relatedPost.slug}`,
            datePublished: relatedPost.date,
            image: relatedPost.thumbnail,
          },
        })),
      }
    : null;

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
