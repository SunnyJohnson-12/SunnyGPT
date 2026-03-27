import { PlusCircle, MessageSquare, Trash2, LogOut } from "lucide-react";
import type { ChatSession } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  sessions: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

export const Sidebar = ({ sessions, activeChatId, onSelectChat, onNewChat, onDeleteChat }: SidebarProps) => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-card/50 border-r border-border h-screen flex flex-col shrink-0 backdrop-blur-md hidden md:flex">
      <div className="p-4 border-b border-border">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          <PlusCircle size={18} />
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
        {sessions.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground mt-8">
            No previous chats
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                activeChatId === session.id
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onSelectChat(session.id)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare size={16} className="shrink-0 opacity-70" />
                <span className="truncate text-sm font-medium">
                  {session.title}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(session.id);
                }}
                className={`opacity-0 group-hover:opacity-100 p-1.5 hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-all ${activeChatId === session.id ? "opacity-100 hover:opacity-100" : ""}`}
                title="Delete Chat"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* User Profile Hook */}
      {user && (
        <div className="p-4 border-t border-border mt-auto bg-card/10">
          <div className="flex items-center gap-3">
            <img 
              src={user.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
              alt={user.name} 
              className="w-9 h-9 rounded-full border border-border/50 shadow-sm"
              onError={(e) => {
                // fallback if google avatar errors out
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
              }}
            />
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-semibold truncate text-card-foreground">{user.name}</p>
            </div>
            <button 
              onClick={logout} 
              className="p-2 hover:bg-destructive hover:text-destructive-foreground text-muted-foreground rounded-lg transition-colors group" 
              title="Sign Out"
            >
              <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
