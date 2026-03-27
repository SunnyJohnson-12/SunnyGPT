import { useCallback, useEffect, useRef, useState } from "react";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import { Sparkles } from "lucide-react";
import type { Message } from "@/lib/types";

interface ChatWindowProps {
  chatId: string;
  initialMessages: Message[];
  onUpdateChat: (id: string, messages: Message[], title?: string) => void;
}

const ChatWindow = ({ chatId, initialMessages, onUpdateChat }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);


  /* Auto-scroll to bottom on new messages or typing */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSend = useCallback((content: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    
    // Update local and parent state immediately
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    onUpdateChat(chatId, newMessages);
    
    setIsTyping(true);

    // Determine URL based on environment
    let API_URL = import.meta.env.VITE_API_URL || "http://localhost:5555";
    // Strip any accidental trailing slashes that cause double-slash //api/chat to fail CORS preflight
    if (API_URL.endsWith('/')) {
      API_URL = API_URL.slice(0, -1);
    }

    // Call Gemini Flash 3 backend
    fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: content })
    })
      .then((res) => res.json())
      .then((data) => {
        const aiMsg: Message = {
          id: crypto.randomUUID(),
          role: "ai",
          content: data.response || "Sorry, I couldn't generate a response.",
        };
        setMessages((prev) => {
          const finalMessages = [...prev, aiMsg];
          onUpdateChat(chatId, finalMessages);
          return finalMessages;
        });
      })
      .catch((error) => {
        console.error("Backend error:", error);
        const errorMsg: Message = {
          id: crypto.randomUUID(),
          role: "ai",
          content: "Oops! Something went wrong connecting to my brain. 🧠⚡",
        };
        setMessages((prev) => {
          const finalMessages = [...prev, errorMsg];
          onUpdateChat(chatId, finalMessages);
          return finalMessages;
        });
      })
      .finally(() => {
        setIsTyping(false);
      });
  }, [messages, chatId, onUpdateChat]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-center gap-2 py-4 border-b border-border bg-background/80 backdrop-blur-md">
        <Sparkles className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground tracking-tight">
          Sunny's GPT
        </h1>
      </header>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground select-none">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl shadow-sm">
              💬
            </div>
            <p className="text-sm font-medium">Start a conversation!</p>
            <p className="text-xs">Type a message below to begin chatting ✨</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatBubble key={msg.id} message={msg} index={i} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
};

export default ChatWindow;
