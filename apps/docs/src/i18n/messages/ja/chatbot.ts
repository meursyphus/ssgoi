import { ChatbotMessages } from "../types/chatbot";

export const chatbot: ChatbotMessages = {
  buttonLabel: "AIに質問",
  drawerTitle: "SSGOI AIアシスタント",
  welcomeMessage:
    "こんにちは！SSGOIについてお気軽にご質問ください。トランジション、設定、インストール方法などをお手伝いします。",
  placeholder: "SSGOIについて質問する...",
  sendButton: "送信",
  errorMessage: "問題が発生しました。もう一度お試しください。",
  rateLimitMessage: "リクエストが多すぎます。しばらくしてからお試しください。",
  poweredBy: "GPT-4o-mini + RAG 搭載",
};
