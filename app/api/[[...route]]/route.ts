import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText, tool } from "ai";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import z from "zod";

const _execFile = promisify(execFile);

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const qwen = createOpenAICompatible({
  name: "qwen",
  baseURL: process.env.API_BASE_URL!,
  apiKey: process.env.API_KEY,
});

app.post("/chat", async (c) => {
  const { messages } = await c.req.json();
  const result = streamText({
    model: qwen("Qwen/Qwen3-8B"),
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
    onChunk: console.log,
    onError: console.error,
    messages,
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
  });
});

app.post("/run-python", async (c) => {
  const { code } = await c.req.json();
  const { stderr, stdout } = await _execFile("python3", ["-c", code], {
    encoding: "utf-8",
  });

  return c.json({ stderr, stdout });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
