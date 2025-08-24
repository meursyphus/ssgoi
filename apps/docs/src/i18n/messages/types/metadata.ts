export type MetadataMessages = {
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