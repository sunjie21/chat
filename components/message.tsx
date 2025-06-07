import { UIMessage } from "ai";
import Markdown from "react-markdown";

export default function Message({ message }: { message: UIMessage }) {
  return (
    <div
      className={
        message.role === "user"
          ? "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-primary text-primary-foreground ml-auto"
          : "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted overflow-y-auto"
      }
    >
      {message.parts.map((part, i) => {
        switch (part.type) {
          case "text":
            return <Markdown key={`${message.id}-${i}`}>{part.text}</Markdown>;
        }
      })}
    </div>
  );
}
