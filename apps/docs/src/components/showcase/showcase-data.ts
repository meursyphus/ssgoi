export interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  tags?: string[];
}

export const showcaseData: ShowcaseItem[] = [
  {
    id: "mvpstar-ai",
    title: "MVPstar.ai",
    description: "AI-powered MVP builder that helps entrepreneurs validate and build their ideas faster with beautiful page transitions powered by SSGOI.",
    url: "https://mvpstar.ai",
    thumbnail: "/showcase/mvpstar-ai.png",
    tags: ["Next.js", "AI", "SaaS"],
  },
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
];