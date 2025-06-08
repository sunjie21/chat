import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import z from "zod";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const openai = createOpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL,
});

app.post("/chat", async (c) => {
  const { messages } = await c.req.json();
  const result = streamText({
    model: openai("Qwen/Qwen3-8B"),
    tools: {
      currentTime: tool({
        description: "Get the current time",
        parameters: z.object({}),
        execute: async () => {
          const currentTime = new Date().toISOString();
          return { currentTime };
        },
      }),
      weather: tool({
        description: "Get the weather in a location",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      }),
    },
    messages,
  });

  return result.toDataStreamResponse();
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
