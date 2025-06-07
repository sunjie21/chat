import { UIMessage } from "ai";
import Markdown from "react-markdown";

export default function Message({ message }: { message: UIMessage }) {
  return (
    <div
      className={message.role === "user" ? "text-blue-500" : "text-green-500"}
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
