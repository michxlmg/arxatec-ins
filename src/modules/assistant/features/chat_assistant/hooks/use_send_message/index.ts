import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConversation, sendMessageStream } from "../../services";
import { useChatAssistant } from "../../context";
import type { AssistantMessage } from "../../types";
import { toast } from "sonner";
import { useCallback } from "react";


export const useSendMessage = () => {
    const workspace = JSON.parse(localStorage.getItem("CURRENT_WORKSPACE") || "null");
    const workspaceId = workspace?.id || workspace?.public_id;

    const {
        onOptimisticMessage,
        conversationId,
        setConversationId,
        updateOptimisticMessagesForId,
        moveOptimisticMessages,
        setConversationGenerating,
        refetchMessages,
    } = useChatAssistant();

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ content, assistantMessageId }: { content: string; assistantMessageId: string }) => {
            let currentConversationId = conversationId;

            if (!currentConversationId) {
                // New conversation logic
                const newId = await createConversation(workspaceId!);
                if (!newId) throw new Error("No se pudo crear la conversación");

                currentConversationId = newId;

                // Update local state FIRST before moving messages
                setConversationId(newId);

                // Navigate BEFORE moving messages to avoid duplication
                navigate(`/chat/${newId}`, { replace: true });

                // Small delay to ensure navigation completes
                await new Promise(resolve => setTimeout(resolve, 50));

                // Move optimistic messages to the real ID
                moveOptimisticMessages("nuevo", newId);

                // Invalidate sidebar history
                queryClient.invalidateQueries({ queryKey: ["assistant-conversations", workspaceId] });
            }

            setConversationGenerating(currentConversationId!, true);

            try {
                await sendMessageStream(workspaceId!, currentConversationId!, content, (chunk) => {
                    updateOptimisticMessagesForId(currentConversationId!, (prev) =>
                        prev.map((msg) => {
                            if (msg.id === assistantMessageId) {
                                const newContent = msg.content === "Pensando..." ? chunk : msg.content + chunk;
                                return { ...msg, content: newContent };
                            }
                            return msg;
                        })
                    );
                });

                // Don't clear optimistic immediately - let refetch handle the transition
                // This prevents the flash/flicker
                await refetchMessages();

                // Now clear optimistic after server data is loaded
                updateOptimisticMessagesForId(currentConversationId!, []);

            } catch (error) {
                console.error("Error sending message:", error);
                // Clear optimistic on error
                updateOptimisticMessagesForId(currentConversationId!, []);
                toast.error("Error al enviar el mensaje");
                throw error;
            } finally {
                setConversationGenerating(currentConversationId!, false);
            }
        }
    });

    const send = useCallback(async (content: string) => {
        if (!content.trim()) return;

        const userOptimisticMessage: AssistantMessage = {
            id: `temp-user-${Date.now()}`,
            content,
            sent_by: "lawyer",
            created_at: new Date(),
        };

        const assistantMessageId = `temp-thinking-${Date.now()}`;
        const thinkingOptimisticMessage: AssistantMessage = {
            id: assistantMessageId,
            content: "Pensando...",
            sent_by: "assistant",
            created_at: new Date(),
        };

        onOptimisticMessage((prev) => [
            ...prev,
            userOptimisticMessage,
            thinkingOptimisticMessage,
        ]);

        mutation.mutate({ content, assistantMessageId });
    }, [onOptimisticMessage, mutation]);

    return { sendMessage: send, isPending: mutation.isPending };
};
