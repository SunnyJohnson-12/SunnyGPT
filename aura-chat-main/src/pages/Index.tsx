import { useState, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";
import { Sidebar } from "@/components/Sidebar";
import { useChatHistory } from "@/hooks/useChatHistory";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Index = () => {
  const { sessions, createChat, updateChat, deleteChat } = useChatHistory();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Initialize first chat if none exists
  useEffect(() => {
    if (sessions.length === 0 && !activeChatId) {
      const id = createChat();
      setActiveChatId(id);
    } else if (sessions.length > 0 && !activeChatId) {
      setActiveChatId(sessions[0].id);
    }
  }, [sessions.length, activeChatId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNewChat = () => {
    const id = createChat();
    setActiveChatId(id);
    setIsMobileOpen(false);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setIsMobileOpen(false);
  }

  const handleDeleteChat = (id: string) => {
    deleteChat(id);
    if (activeChatId === id) {
      setActiveChatId(sessions.length > 1 ? sessions.find(s => s.id !== id)?.id || null : null);
    }
  };

  const activeSession = sessions.find(s => s.id === activeChatId) || null;

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Desktop Sidebar */}
      <Sidebar 
        sessions={sessions}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      <main className="flex-1 min-w-0 flex flex-col h-screen relative">
        {/* Mobile Header with Hamburger */}
        <div className="md:hidden absolute top-4 left-4 z-50">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <button className="p-2 bg-background/80 backdrop-blur-md rounded-md border shadow-sm">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
               <Sidebar 
                  sessions={sessions}
                  activeChatId={activeChatId}
                  onSelectChat={handleSelectChat}
                  onNewChat={handleNewChat}
                  onDeleteChat={handleDeleteChat}
                />
            </SheetContent>
          </Sheet>
        </div>

        {activeSession ? (
          <ChatWindow 
            key={activeChatId} 
            chatId={activeChatId}
            initialMessages={activeSession.messages}
            onUpdateChat={updateChat}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p>Loading your chats...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
