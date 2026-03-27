export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}
