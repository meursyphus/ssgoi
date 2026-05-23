import type { ShowcaseApp } from "@/page/showcase/types";

export const kakaoTalkShowcase: ShowcaseApp = {
  slug: "kakao-talk",
  name: "KakaoTalk",
  tagline: "Tab axis + sheet profile + drill chat detail",
  platforms: ["mobile"],
  category: "Messenger",
  badge: "New",
  logo: "/kakao-talk-icon.svg",
  demoOrigin: "/demo/kakao-talk",
  transitions: ["axis", "sheet", "drill"],
  sourcePath: "apps/docs/src/demo/kakao-talk",
  previewTransition: "axis",
  clips: [
    {
      title: "친구 ↔ 채팅 (탭)",
      transition: "axis",
      enterPath: "/demo/kakao-talk/chats",
      exitPath: "/demo/kakao-talk",
      caption: "Axis x — tab bar에서 좌우 슬라이드",
    },
    {
      title: "친구 → 프로필",
      transition: "sheet",
      enterPath: "/demo/kakao-talk/profile/f-002",
      exitPath: "/demo/kakao-talk",
      caption: "Sheet static — 프로필 카드가 위로 올라옴",
    },
    {
      title: "채팅 목록 → 채팅방",
      transition: "drill",
      enterPath: "/demo/kakao-talk/chats/c-001",
      exitPath: "/demo/kakao-talk/chats",
      caption: "Drill — 채팅방으로 push/pop",
    },
  ],
};
