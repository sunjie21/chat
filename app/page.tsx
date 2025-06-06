"use client";

import Preview from "@/components/preview";
import { useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";

const ReactCodeStart = "```jsx\n";
const ReactCodeEnd = "```";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [reactCode, setReactCode] = useState("");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const content = lastMessage.content;
      if (content.includes(ReactCodeStart)) {
        setIsGeneratingCode(true);

        const startIdx = content.lastIndexOf(ReactCodeStart);
        const endIdx = content.lastIndexOf(ReactCodeEnd);
        const code = content
          .substring(
            startIdx + ReactCodeStart.length,
            endIdx > startIdx ? endIdx : content.length
          )
          .trim();
        setReactCode(code);
      }

      if (lastMessage.role === "assistant" && lastMessage.parts.length > 0) {
        const lastPart = lastMessage.parts[lastMessage.parts.length - 1];
        if (lastPart.type === "text") {
          // Scroll to the bottom of the chat
          window.scrollTo(0, document.body.scrollHeight);
        }
      }
    }
  }, [messages]);

  return (
    <div className="flex justify-center max-h-screen">
      <div className="flex flex-col w-full max-w-md mx-6 py-24 stretch overflow-y-auto mb-24">
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            {message.role === "user" ? "User: " : "AI: "}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return <div key={`${message.id}-${i}`}>{part.text}</div>;
              }
            })}
          </div>
        ))}

        <form onSubmit={handleSubmit}>
          <input
            className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
      {isGeneratingCode && (
        <div className="overflow-y-auto">
          <pre className="mb-6">{reactCode}</pre>
          <Preview code={reactCode} />
        </div>
      )}
    </div>
  );
}
