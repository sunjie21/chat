import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const openai = createOpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL,
});

app.post("/chat", async (c) => {
  const { messages } = await c.req.json();
  const result = streamText({
    model: openai("Qwen/Qwen3-8B"),
    messages,
  });

  return result.toDataStreamResponse();
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
