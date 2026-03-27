/* Typing indicator with bouncing dots */
const TypingIndicator = () => (
  <div className="flex items-start gap-3 animate-message-in px-4 max-w-2xl mx-auto">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm">
      🤖
    </div>
    <div className="bubble-ai rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
      <div className="flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground/60 inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground/60 inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground/60 inline-block" />
      </div>
    </div>
  </div>
);

export default TypingIndicator;
