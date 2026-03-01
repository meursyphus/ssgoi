import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const CONTENT_DIR = path.join(process.cwd(), "content");
const LANGUAGES = ["en", "ko", "ja"];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

interface DocChunk {
  lang: string;
  doc_path: string;
  heading: string;
  content: string;
  url: string;
}

async function getMdxFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getMdxFiles(fullPath)));
    } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function cleanMdx(text: string): string {
  // Extract code blocks, replace with placeholders, clean, then restore
  const codeBlocks: string[] = [];
  const withPlaceholders = text.replace(/(`{3,}[\s\S]*?`{3,})/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  const cleaned = withPlaceholders
    // Remove import statements
    .replace(/^import\s+.*$/gm, "")
    // Remove all JSX/HTML-like tags but keep inner content
    .replace(/<\/?[A-Za-z][A-Za-z0-9]*[^>]*>/g, "")
    // Collapse multiple blank lines
    .replace(/\n{3,}/g, "\n\n");

  // Restore code blocks
  return cleaned.replace(
    /__CODE_BLOCK_(\d+)__/g,
    (_, i) => codeBlocks[Number(i)],
  );
}

const MAX_CHUNK_LENGTH = 1500;

function splitLongChunk(
  heading: string,
  content: string,
): { heading: string; content: string }[] {
  if (content.length <= MAX_CHUNK_LENGTH) {
    return [{ heading, content }];
  }

  // Split by code blocks as natural boundaries (handles indented code fences)
  const parts: { heading: string; content: string }[] = [];
  const segments = content.split(/\n(?=\s*```)/);
  let current = "";
  let partIndex = 1;

  for (const segment of segments) {
    if (
      current.length + segment.length > MAX_CHUNK_LENGTH &&
      current.length > 0
    ) {
      parts.push({
        heading: `${heading} (${partIndex})`,
        content: current.trim(),
      });
      partIndex++;
      current = segment;
    } else {
      current += (current ? "\n" : "") + segment;
    }
  }

  if (current.trim().length > 20) {
    parts.push({
      heading: parts.length > 0 ? `${heading} (${partIndex})` : heading,
      content: current.trim(),
    });
  }

  return parts;
}

function splitByHeadings(
  content: string,
): { heading: string; content: string }[] {
  const lines = content.split("\n");
  const rawChunks: { heading: string; content: string }[] = [];
  let currentHeading = "Introduction";
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^#{2,3}\s+(.+)/);
    if (headingMatch) {
      if (currentContent.length > 0) {
        const text = currentContent.join("\n").trim();
        if (text.length > 20) {
          rawChunks.push({ heading: currentHeading, content: text });
        }
      }
      currentHeading = headingMatch[1];
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentContent.length > 0) {
    const text = currentContent.join("\n").trim();
    if (text.length > 20) {
      rawChunks.push({ heading: currentHeading, content: text });
    }
  }

  // Split oversized chunks
  return rawChunks.flatMap((c) => splitLongChunk(c.heading, c.content));
}

function buildUrl(lang: string, filePath: string): string {
  const relative = path.relative(path.join(CONTENT_DIR, lang), filePath);
  const segments = relative
    .replace(/\.mdx?$/, "")
    .split(path.sep)
    .map((s) => s.replace(/^\d+\./, ""));
  return `/${lang}/docs/${segments.join("/")}`;
}

async function embedTexts(texts: string[]): Promise<number[][]> {
  const batchSize = 100;
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: batch,
    });
    embeddings.push(...res.data.map((d) => d.embedding));
  }

  return embeddings;
}

async function main() {
  console.log("Starting doc ingestion...");

  const allChunks: DocChunk[] = [];

  for (const lang of LANGUAGES) {
    const langDir = path.join(CONTENT_DIR, lang);
    try {
      await fs.access(langDir);
    } catch {
      console.log(`  Skipping ${lang} (directory not found)`);
      continue;
    }

    const files = await getMdxFiles(langDir);
    console.log(`  ${lang}: found ${files.length} files`);

    for (const file of files) {
      const raw = await fs.readFile(file, "utf-8");
      const { content, data: frontmatter } = matter(raw);
      const docTitle = frontmatter.title || "";

      const cleaned = cleanMdx(content);
      const sections = splitByHeadings(cleaned);
      const docPath = path.relative(CONTENT_DIR, file);
      const url = buildUrl(lang, file);

      for (const section of sections) {
        allChunks.push({
          lang,
          doc_path: docPath,
          heading: `${docTitle} > ${section.heading}`,
          content: section.content,
          url,
        });
      }
    }
  }

  console.log(`Total chunks: ${allChunks.length}`);

  if (allChunks.length === 0) {
    console.log("No chunks to process. Exiting.");
    return;
  }

  // Dry run mode: dump chunks to file for inspection
  if (process.argv.includes("--dry-run")) {
    const dryLang = process.argv[process.argv.indexOf("--dry-run") + 1] || null;
    const filtered = dryLang
      ? allChunks.filter((c) => c.lang === dryLang)
      : allChunks;
    const outPath = path.join(process.cwd(), "chunks-preview.md");
    const lines = filtered.map(
      (c, i) =>
        `# Chunk ${i + 1} [${c.lang}] ${c.heading}\n**url:** ${c.url} | **len:** ${c.content.length}\n\n${c.content}\n\n---\n`,
    );
    await fs.writeFile(outPath, lines.join("\n"), "utf-8");
    console.log(`Preview saved to: ${outPath} (${filtered.length} chunks)`);
    if (process.argv.includes("--preview-only")) {
      return;
    }
  }

  // Generate embeddings
  console.log("Generating embeddings...");
  const texts = allChunks.map((c) => `${c.heading}\n${c.content}`);
  const embeddings = await embedTexts(texts);

  // Clear existing data and insert new
  console.log("Clearing existing doc_chunks...");
  const { error: deleteError } = await supabase
    .from("doc_chunks")
    .delete()
    .neq("id", 0);

  if (deleteError) {
    console.error("Delete error:", deleteError);
    return;
  }

  console.log("Inserting new chunks...");
  const rows = allChunks.map((chunk, i) => ({
    lang: chunk.lang,
    doc_path: chunk.doc_path,
    heading: chunk.heading,
    content: chunk.content,
    url: chunk.url,
    embedding: JSON.stringify(embeddings[i]),
  }));

  // Insert in batches of 50
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50);
    const { error: insertError } = await supabase
      .from("doc_chunks")
      .insert(batch);

    if (insertError) {
      console.error(`Insert error at batch ${i}:`, insertError);
      return;
    }
    console.log(`  Inserted ${Math.min(i + 50, rows.length)}/${rows.length}`);
  }

  console.log("Done! Ingestion complete.");
}

main().catch(console.error);
