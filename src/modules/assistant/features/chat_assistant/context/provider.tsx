import React from "react";
import { ChatAssistantContext } from "./index";
import { useChatLogic } from "../hooks/use_chat_logic";

export const ChatAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useChatLogic();

  return (
    <ChatAssistantContext.Provider value={value}>
      {children}
    </ChatAssistantContext.Provider>
  );
};
