import { HeaderMessages } from "./header";
import { MobileMenuMessages } from "./mobile-menu";
import { HomeMessages } from "./home";
import { MetadataMessages } from "./metadata";
import { SidebarMessages } from "./sidebar";
import { ConsoleMessages } from "./console";
import { BlogMessages } from "./blog";

export type Messages = {
  header: HeaderMessages;
  mobileMenu: MobileMenuMessages;
  home: HomeMessages;
  metadata: MetadataMessages;
  sidebar: SidebarMessages;
  console: ConsoleMessages;
  blog: BlogMessages;
};

export type {
  HeaderMessages,
  MobileMenuMessages,
  HomeMessages,
  MetadataMessages,
  SidebarMessages,
  ConsoleMessages,
  BlogMessages,
};