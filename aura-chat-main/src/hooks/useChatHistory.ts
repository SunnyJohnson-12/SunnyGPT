import { useState, useEffect } from "react";
import type { ChatSession, Message } from "@/lib/types";

const STORAGE_KEY = "lovable_chats_history";

export const useChatHistory = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
  }, []);

  const saveSessions = (newSessions: ChatSession[]) => {
    const sorted = [...newSessions].sort((a, b) => b.updatedAt - a.updatedAt);
    setSessions(sorted);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  };

  const createChat = () => {
    const newChat: ChatSession = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      updatedAt: Date.now(),
    };
    saveSessions([newChat, ...sessions]);
    return newChat.id;
  };

  const updateChat = (id: string, messages: Message[], title?: string) => {
    const chatExists = sessions.some(s => s.id === id);
    let newSessions = sessions;
    
    if (!chatExists) {
      newSessions = [{
        id,
        title: title || "New Chat",
        messages,
        updatedAt: Date.now()
      }, ...sessions];
    } else {
      newSessions = sessions.map((s) => {
        if (s.id === id) {
          // Auto-generate title from first user message if it's currently "New Chat" and this is the first real message
          let newTitle = title || s.title;
          if (newTitle === "New Chat" && messages.length > 0) {
            const firstUserMsg = messages.find(m => m.role === "user");
            if (firstUserMsg) {
              newTitle = firstUserMsg.content.substring(0, 30) + (firstUserMsg.content.length > 30 ? "..." : "");
            }
          }
          return {
            ...s,
            messages,
            title: newTitle,
            updatedAt: Date.now(),
          };
        }
        return s;
      });
    }
    saveSessions(newSessions);
  };

  const deleteChat = (id: string) => {
    saveSessions(sessions.filter((s) => s.id !== id));
  };

  return { sessions, createChat, updateChat, deleteChat };
};
