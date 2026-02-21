import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
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
    .find((m: { role: string }) => m.role === "user");

  if (!lastUserMessage) {
    return new Response("No user message found", { status: 400 });
  }

  const embeddingRes = await openaiClient.embeddings.create({
    model: "text-embedding-3-small",
    input: lastUserMessage.content,
  });
  const queryEmbedding = embeddingRes.data[0].embedding;

  const { data: chunks, error } = await supabase.rpc("match_doc_chunks", {
    query_embedding: queryEmbedding,
    match_lang: lang,
    match_count: 5,
    match_threshold: 0.3,
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
Answer questions based on the documentation context below. Be concise and helpful.
If the context doesn't contain relevant information, say so honestly.
Respond in the same language as the user's question.

## Documentation Context
${context}`;

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages,
    maxOutputTokens: 1024,
    temperature: 0.1,
  });

  return result.toUIMessageStreamResponse();
}
