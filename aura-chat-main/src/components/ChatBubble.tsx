import { marked } from "marked";
import DOMPurify from "dompurify";
import type { Message } from "@/lib/types";

const AI_EMOJIS = ["💖", "✨", "🌸", "🤖", "🦋", "💫"];

interface ChatBubbleProps {
  message: Message;
  index: number;
}

/* Individual chat bubble – user on right, AI on left */
const ChatBubble = ({ message, index }: ChatBubbleProps) => {
  const isUser = message.role === "user";
  const emoji = AI_EMOJIS[index % AI_EMOJIS.length];

  return (
    <div
      className={`flex items-start gap-3 animate-message-in px-4 max-w-2xl mx-auto ${
        isUser ? "flex-row-reverse" : ""
      }`}
      style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm ${
          isUser ? "bubble-user" : "bg-secondary"
        }`}
      >
        {isUser ? "😊" : "🤖"}
      </div>

      <div
        className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bubble-user rounded-2xl rounded-tr-md"
            : "bubble-ai rounded-2xl rounded-tl-md w-full"
        }`}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap">{message.content}</span>
        ) : (
          <div className="flex gap-1.5 w-full">
            <span className="shrink-0 pt-0.5">{emoji}</span>
            <div
              className="prose prose-sm dark:prose-invert max-w-none break-words overflow-x-auto w-full prose-p:leading-relaxed prose-p:m-0 prose-ul:m-0 prose-ol:m-0"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked.parse(message.content) as string),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
