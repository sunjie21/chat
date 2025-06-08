"use client";

import Canvas from "@/components/canvas";
import Message from "@/components/message";
import { CodeBlock, extractCodeBlock } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [isOpen, setIsOpen] = useState(true);
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const content = lastMessage.content;
      const codes = extractCodeBlock(content);
      setCodeBlocks(codes);

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
    <div className="flex justify-center items-end mb-24">
      <div className="flex flex-col w-3/6 mx-6 py-24 stretch overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            <Message message={message} />
          </div>
        ))}

        <form onSubmit={handleSubmit}>
          <input
            // className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-3/6 p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
            className="fixed bottom-0 w-3/6 p-2 mb-8 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex-1 pr-10"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
      {codeBlocks.length > 0 && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent>
            <Canvas codeBlocks={codeBlocks} />
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            {isOpen ? <ChevronRight /> : <ChevronLeft />}
          </CollapsibleTrigger>
        </Collapsible>
      )}
    </div>
  );
}
