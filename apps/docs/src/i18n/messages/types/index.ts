import { HeaderMessages } from "./header";
import { MobileMenuMessages } from "./mobile-menu";
import { HomeMessages } from "./home";
import { MetadataMessages } from "./metadata";
import { SidebarMessages } from "./sidebar";
import { ConsoleMessages } from "./console";
import { BlogMessages } from "./blog";
import { HomeStructuredDataMessages } from "./home-structured-data";
import { BlogStructuredDataMessages } from "./blog-structured-data";
import { DocsStructuredDataMessages } from "./docs-structured-data";

export type Messages = {
  header: HeaderMessages;
  mobileMenu: MobileMenuMessages;
  home: HomeMessages;
  metadata: MetadataMessages;
  sidebar: SidebarMessages;
  console: ConsoleMessages;
  blog: BlogMessages;
  homeStructuredData: HomeStructuredDataMessages;
  blogStructuredData: BlogStructuredDataMessages;
  docsStructuredData: DocsStructuredDataMessages;
};

export type {
  HeaderMessages,
  MobileMenuMessages,
  HomeMessages,
  MetadataMessages,
  SidebarMessages,
  ConsoleMessages,
  BlogMessages,
  HomeStructuredDataMessages,
  BlogStructuredDataMessages,
  DocsStructuredDataMessages,
};