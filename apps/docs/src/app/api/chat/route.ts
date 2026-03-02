import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import OpenAI from "openai";
import { headers } from "next/headers";

export const runtime = "nodejs";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { success } = rateLimit(ip);
  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }

  const { messages, lang = "en" } = await req.json();

  const lastUserMessage = [...messages]
    .reverse()
    .find((m: { role: string }) => m.role === "user") as
    | {
        role: string;
        content?: string;
        parts?: { type: string; text?: string }[];
      }
    | undefined;

  if (!lastUserMessage) {
    return new Response("No user message found", { status: 400 });
  }

  // AI SDK v6 sends parts array, fallback to content for curl/direct calls
  const userText =
    lastUserMessage.content ||
    lastUserMessage.parts
      ?.filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("") ||
    "";

  if (!userText) {
    return new Response("Empty user message", { status: 400 });
  }

  const embeddingRes = await openaiClient.embeddings.create({
    model: "text-embedding-3-small",
    input: userText,
  });
  const queryEmbedding = embeddingRes.data[0].embedding;

  const { data: chunks, error } = await supabase.rpc("match_doc_chunks", {
    query_embedding: queryEmbedding,
    match_lang: lang,
    match_count: 12,
    match_threshold: 0.2,
  });

  if (error) {
    console.error("Supabase RPC error:", error);
  }

  const context =
    chunks && chunks.length > 0
      ? chunks
          .map(
            (c: { heading: string; content: string; url: string }) =>
              `### ${c.heading}\n${c.content}\n(Source: ${c.url})`,
          )
          .join("\n\n---\n\n")
      : "No relevant documentation found.";

  const systemPrompt = `You are an AI assistant for SSGOI (쓱오이), a universal page transition library for web applications.

STRICT RULES:
- ONLY use information from the Documentation Context below. Do NOT make up code, APIs, or package names.
- If the context contains code examples, quote them EXACTLY as they appear in the documentation. Never modify, simplify, or invent code.
- When documentation provides explanations or warnings (e.g., "왜 position: relative가 필요한가요?"), include them as-is from the original text.
- The correct package names are @ssgoi/react, @ssgoi/svelte, @ssgoi/vue, @ssgoi/solid, @ssgoi/angular — NEVER use "ssgoi" alone.
- If the context doesn't contain directly relevant information, do your best to answer based on the closest matching context. Only say you can't find information if the context is completely unrelated to the question.
- At the end of your answer, include the source page URL from the context so the user can read the full documentation.
- Respond in the same language as the user's question.

## Documentation Context
${context}`;

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: modelMessages,
    maxOutputTokens: 1024,
    temperature: 0.1,
  });

  return result.toUIMessageStreamResponse();
}
