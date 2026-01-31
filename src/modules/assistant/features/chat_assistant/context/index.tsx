import { createContext, useContext } from "react";
import type { AssistantMessage } from "../types";

export interface ChatAssistantContextType {
  messages: AssistantMessage[];
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
  isLoadingMessages: boolean;
  isErrorMessages: boolean;
  conversationTitle: string;
  isGenerating: boolean;
  onOptimisticMessage: (action: React.SetStateAction<AssistantMessage[]>) => void;
  updateOptimisticMessagesForId: (id: string, action: React.SetStateAction<AssistantMessage[]>) => void;
  moveOptimisticMessages: (fromId: string, toId: string) => void;
  setConversationGenerating: (id: string, is: boolean) => void;
  refetchMessages: () => void;
}

export const ChatAssistantContext = createContext<ChatAssistantContextType | undefined>(undefined);

export const useChatAssistant = () => {
  const context = useContext(ChatAssistantContext);
  if (!context) throw new Error("useChatAssistant must be used within a ChatAssistantProvider");
  return context;
};
