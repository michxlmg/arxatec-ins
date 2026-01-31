import { useEffect, useRef } from "react";
import { Message, MessageAssistant, SendMessage, HeaderMessages } from "../components";
import { useChatAssistant } from "../context";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const workspace = JSON.parse(localStorage.getItem("CURRENT_WORKSPACE") || "null");

  const {
    messages,
    conversationId,
    isLoadingMessages,
  } = useChatAssistant();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if it's a new conversation
  const isNewConversation = !id || id.toLowerCase() === "nuevo";

  // Show welcome message for new sessions or if specifically on /nuevo
  // and we have NO messages yet.
  if (isNewConversation && messages.length === 0) {
    return (
      <div className="flex flex-col h-full bg-background text-foreground overflow-hidden">
        <div className="max-w-4xl mx-auto w-full h-full px-8 py-8 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Nueva consulta</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-8">
              ¡Hola! Soy tu asistente legal en <strong>{workspace?.name || "tu espacio"}</strong>. ¿En qué puedo ayudarte hoy?
            </p>
            <div className="w-full max-w-2xl">
              <SendMessage />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine if we should show a loading skeleton or the actual messages.
  // We only show the full-screen loader if we have NO messages and are loading.
  // If we have messages (optimistic or server), we show them even if the next page is loading.
  const showFullLoader = isLoadingMessages && messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-background text-foreground overflow-hidden">
      {/* Header - Only for existing conversations or when we HAVE messages */}
      {!isNewConversation && <HeaderMessages conversationId={conversationId!} />}

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 py-8 space-y-6 scrollbar-thin scrollbar-thumb-accent">
        <div className="max-w-3xl mx-auto w-full">
          {showFullLoader ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
              <p className="text-sm">Cargando mensajes...</p>
            </div>
          ) : (
            <>
              {messages.map((msg) =>
                msg.sent_by === "assistant" ? (
                  <MessageAssistant key={msg.id} content={msg.content} />
                ) : (
                  <Message key={msg.id} content={msg.content} />
                )
              )}
              {/* Optional: Show a subtle indicator if it's refetching in the background */}
            </>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Area */}
      <div className="p-4 bg-gradient-to-t from-background via-background to-transparent border-t border-border/40">
        <div className="max-w-3xl mx-auto">
          <SendMessage />
        </div>
      </div>
    </div>
  );
}
