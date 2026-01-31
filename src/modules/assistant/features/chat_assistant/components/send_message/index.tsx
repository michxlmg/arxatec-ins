import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { SendIcon, Loader2 } from "lucide-react";
import { useSendMessage } from "../../hooks/use_send_message";

export const SendMessage: React.FC = () => {
  const [input, setInput] = useState("");
  const { sendMessage, isPending } = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const content = input;
    setInput("");
    await sendMessage(content);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <div className="relative flex-1 group">
          <Input
            placeholder="Escribe tu consulta legal..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-card/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/30 h-12 px-4 rounded-xl transition-all"
            disabled={isPending}
          />
        </div>
        <Button
          type="submit"
          size="icon"
          className="shrink-0 h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          disabled={!input.trim() || isPending}
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </Button>
      </form>
      <div className="text-center mt-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium opacity-60">
          Potenciado por IA Legal Arxatec
        </p>
      </div>
    </div>
  );
};
