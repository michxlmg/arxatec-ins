import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AssistantMessage } from "../../types";
import { getAssistantMessages, getConversationById } from "../../services";
import { mergeMessages } from "../../utilities";
import { useParams } from "react-router-dom";

export const useChatLogic = () => {
    const { id: assistantId } = useParams();
    const workspace = JSON.parse(localStorage.getItem("CURRENT_WORKSPACE") || "null");
    const workspaceId = workspace?.id || workspace?.public_id;

    const [conversationId, setConversationId] = useState<string | null>(null);
    const [conversationsState, setConversationsState] = useState<
        Record<string, { optimisticMessages: AssistantMessage[]; isGenerating?: boolean }>
    >({});

    useEffect(() => {
        if (!assistantId || assistantId.toLowerCase() === "nuevo") {
            setConversationId(null);
        } else {
            setConversationId(assistantId);
        }
    }, [assistantId]);

    // Messages Query - only enabled for existing conversations
    const {
        data: messagesData,
        refetch: refetchMessages,
        isPending: isLoadingMessages,
        isError: isErrorMessages,
    } = useQuery({
        queryKey: ["assistant-messages", conversationId],
        queryFn: () => getAssistantMessages(workspaceId!, conversationId!),
        enabled: !!conversationId && !!workspaceId && conversationId !== "nuevo",
    });

    // Conversation Query
    const {
        data: conversation,
        isPending: isLoadingConversation,
    } = useQuery({
        queryKey: ["assistant-conversation", conversationId],
        queryFn: () => getConversationById(workspaceId!, conversationId!),
        enabled: !!conversationId && !!workspaceId && conversationId !== "nuevo",
    });

    const updateOptimisticMessagesForId = useCallback(
        (targetId: string, action: React.SetStateAction<AssistantMessage[]>) => {
            setConversationsState((prev) => {
                const currentState = prev[targetId] || { optimisticMessages: [] };
                const newMessages =
                    typeof action === "function"
                        ? action(currentState.optimisticMessages)
                        : action;

                return {
                    ...prev,
                    [targetId]: { ...currentState, optimisticMessages: newMessages },
                };
            });
        },
        []
    );

    const moveOptimisticMessages = useCallback((fromId: string, toId: string) => {
        setConversationsState((prev) => {
            const fromState = prev[fromId];
            if (!fromState) return prev;

            return {
                ...prev,
                [fromId]: { ...fromState, optimisticMessages: [] },
                [toId]: {
                    ...(prev[toId] || {}),
                    optimisticMessages: [
                        ...(prev[toId]?.optimisticMessages || []),
                        ...fromState.optimisticMessages,
                    ],
                    isGenerating: prev[toId]?.isGenerating || fromState.isGenerating,
                },
            };
        });
    }, []);

    const setConversationGenerating = useCallback(
        (targetId: string, isGenerating: boolean) => {
            setConversationsState((prev) => {
                const currentState = prev[targetId] || { optimisticMessages: [] };
                if (currentState.isGenerating === isGenerating) return prev;

                return {
                    ...prev,
                    [targetId]: { ...currentState, isGenerating },
                };
            });
        },
        []
    );

    const optimisticMessages = useMemo(() => {
        const key = conversationId || "nuevo";
        return conversationsState[key]?.optimisticMessages || [];
    }, [conversationId, conversationsState]);

    const isGenerating = useMemo(() => {
        const key = conversationId || "nuevo";
        return conversationsState[key]?.isGenerating || false;
    }, [conversationId, conversationsState]);

    const messages = useMemo(() => {
        const transformedMessages: AssistantMessage[] = (messagesData ?? []).map(
            (item) => ({
                id: item.id,
                content: item.content,
                sent_by: item.role,
                created_at: new Date(item.created_at),
            })
        );

        return mergeMessages(transformedMessages, optimisticMessages);
    }, [messagesData, optimisticMessages]);

    const onOptimisticMessage = useCallback(
        (action: React.SetStateAction<AssistantMessage[]>) => {
            const key = conversationId || "nuevo";
            updateOptimisticMessagesForId(key, action);
        },
        [conversationId, updateOptimisticMessagesForId]
    );

    const conversationTitle = useMemo(() => {
        if (isLoadingConversation) return "Cargando...";
        if (conversation) return conversation.title || "Nueva consulta";
        return "Nueva consulta";
    }, [conversation, isLoadingConversation]);

    return {
        messages,
        conversationId,
        setConversationId,
        isLoadingMessages,
        isErrorMessages,
        conversationTitle,
        isGenerating,
        onOptimisticMessage,
        updateOptimisticMessagesForId,
        moveOptimisticMessages,
        setConversationGenerating,
        refetchMessages
    };
};
