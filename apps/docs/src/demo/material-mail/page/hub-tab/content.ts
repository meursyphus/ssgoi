import {
  Video,
  MessageCircle,
  Users,
  MessageSquarePlus,
  Plus,
  type LucideIcon,
} from "lucide-react";

export type HubKind = "meet" | "chat" | "spaces";

type HubAction = {
  label: string;
  filled?: boolean;
  toast: string;
  description?: string;
};

export type HubContent = {
  title: string;
  icon: LucideIcon;
  heading: string;
  text: string;
  actions: HubAction[];
  fab: (HubAction & { icon: LucideIcon }) | null;
};

export const HUBS: Record<HubKind, HubContent> = {
  meet: {
    title: "Meet",
    icon: Video,
    heading: "Get a link to share",
    text: "Start a meeting and send the link to anyone you want to meet with.",
    actions: [
      {
        label: "New meeting",
        filled: true,
        toast: "Meeting link copied",
        description: "meet.example/kdw-rtqa-zpe",
      },
      { label: "Join with a code", toast: "Joining with a code is mocked" },
    ],
    fab: null,
  },
  chat: {
    title: "Chat",
    icon: MessageCircle,
    heading: "Start a conversation",
    text: "Message a teammate directly, or bring a few people into a group chat.",
    actions: [],
    fab: {
      label: "New chat",
      icon: MessageSquarePlus,
      toast: "New chat is mocked in this demo",
    },
  },
  spaces: {
    title: "Spaces",
    icon: Users,
    heading: "Find a space to join",
    text: "Spaces bring a team's chat, files and tasks together in one place.",
    actions: [{ label: "Browse spaces", toast: "Browsing spaces is mocked" }],
    fab: {
      label: "New space",
      icon: Plus,
      toast: "Creating a space is mocked in this demo",
    },
  },
};
