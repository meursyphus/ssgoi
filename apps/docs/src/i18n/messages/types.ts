export type Messages = {
  header: {
    home: string;
    blog: string;
    github: string;
    docs: string;
    tutorial: string;
    contributing: string;
    showcase: string;
  };
  home: {
    title: string;
    getStarted: string;
    readMore: string;
  };
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    og: {
      title: string;
      description: string;
      siteName: string;
      imageAlt: string;
    };
    twitter: {
      title: string;
      description: string;
      imageAlt: string;
    };
  };
};
