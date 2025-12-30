export interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  url: string;
  thumbnail: string; // Static image shown by default
  gif?: string; // Animated GIF shown on hover (optional)
  gallery?: string[]; // Additional images/GIFs for the modal gallery
  tags?: string[];
  framework?: string;
  transitions?: string[]; // SSGOI transitions used
  year?: number;
  featured?: boolean;
}

export const showcaseData: ShowcaseItem[] = [
  // Add your site here by submitting a PR!
  // Example:
  // {
  //   id: "your-site-id",
  //   title: "Your Site Name",
  //   description: "Brief description of your site and how it uses SSGOI",
  //   longDescription: "Detailed description about how SSGOI enhanced your site...",
  //   url: "https://yoursite.com",
  //   thumbnail: "/showcase/your-site.png", // Static image (required)
  //   gif: "/showcase/your-site.gif", // Animated preview on hover (optional)
  //   gallery: ["/showcase/your-site-1.gif", "/showcase/your-site-2.png"],
  //   tags: ["React", "E-commerce"],
  //   framework: "Next.js",
  //   transitions: ["fade", "slide", "hero"],
  //   year: 2024,
  //   featured: true,
  // },

  {
    id: "seoulbiyori",
    title: "Seoul Biyori",
    description:
      "A mobile web app for Japanese tourists visiting Seoul, built by a non-developer using MVPStar vibe-coding tool.",
    longDescription:
      "Seoul Biyori (ソウル日和) is a comprehensive guide for Japanese visitors to Seoul. Built by a non-developer using MVPStar (https://mvpstar.ai), a Korean vibe-coding tool, this app showcases the best of Seoul's dining, cafes, shopping spots, and events. SSGOI transitions create a native app-like experience, proving that smooth web animations are accessible to everyone.",
    url: "https://www.seoulbiyori.com",
    thumbnail: "/showcase/seoulbiyori.webp",
    gif: "/showcase/seoulbiyori.gif",
    gallery: ["/showcase/seoulbiyori.gif"],
    tags: ["Travel", "Mobile", "No-Code"],
    framework: "Next.js",
    transitions: ["swap", "drill"],
    year: 2025,
    featured: true,
  },
  {
    id: "burrr",
    title: "Burrr AI",
    description:
      "A Seoul-based startup driving innovation with generative AI, chatbots, and cutting-edge AI solutions.",
    longDescription:
      "Burrr AI leverages SSGOI's smooth page transitions to create a premium feel for their AI-powered platform. The seamless navigation between different sections showcases the company's innovative approach to user experience, matching their cutting-edge AI solutions with equally impressive web interactions.",
    url: "https://burrr.ai",
    thumbnail: "/showcase/burrr.webp",
    gif: "/showcase/burrr.gif",
    gallery: ["/showcase/burrr.gif"],
    tags: ["AI", "Chatbot", "Startup"],
    framework: "SvelteKit",
    transitions: ["fade", "slide"],
    year: 2024,
    featured: true,
  },
];
