export interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  tags?: string[];
}

export const showcaseData: ShowcaseItem[] = [
  // Add your site here by submitting a PR!
  // Example:
  // {
  //   id: "your-site-id",
  //   title: "Your Site Name",
  //   description: "Brief description of your site and how it uses SSGOI",
  //   url: "https://yoursite.com",
  //   thumbnail: "/showcase/your-site.png", // Add image to public/showcase/
  //   tags: ["React", "E-commerce", etc.],
  // },

  {
    id: "burrr",
    title: "Burrr AI",
    description: "A Seoul-based startup driving innovation with generative AI, chatbots, and cutting-edge AI solutions.",
    url: "https://burrr.ai",
    thumbnail: "/showcase/burrr.gif",
    tags: ["AI", "Chatbot", "Sveltekit"],
  },
];
