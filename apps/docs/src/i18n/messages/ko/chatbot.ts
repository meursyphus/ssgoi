import { ChatbotMessages } from "../types/chatbot";

export const chatbot: ChatbotMessages = {
  buttonLabel: "AI에게 질문",
  drawerTitle: "SSGOI AI 어시스턴트",
  welcomeMessage:
    "안녕하세요! SSGOI에 대해 궁금한 점을 물어보세요. 트랜지션, 설정, 설치 방법 등을 도와드릴 수 있습니다.",
  placeholder: "SSGOI에 대해 질문하세요...",
  sendButton: "전송",
  errorMessage: "문제가 발생했습니다. 다시 시도해주세요.",
  rateLimitMessage: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  poweredBy: "GPT-4o-mini + RAG 기반",
};
