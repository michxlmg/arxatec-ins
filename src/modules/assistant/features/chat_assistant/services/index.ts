import { axiosInstance } from "@/interceptors";
import { API_URL } from "@/config";
import { processStreamResponse } from "@/utilities";
import type { ApiResponse } from "@/types";
import type { MessageResponseItem, ConversationResponseData } from "../types";

export const createConversation = async (
    workspaceId: string
): Promise<string | null> => {
    try {
        const { data } = await axiosInstance.post<ApiResponse<ConversationResponseData>>(
            `/${workspaceId}/assistant/conversations`,
            { title: "Nueva consulta" }
        );
        return data.data?.id || null;
    } catch (error) {
        console.error("Error creating conversation:", error);
        return null;
    }
};

export const sendMessageStream = async (
    workspaceId: string,
    conversationId: string,
    message: string,
    onChunk: (chunk: string) => void
): Promise<void> => {
    const token = window.localStorage.getItem("TOKEN_AUTH");
    const apiUrl = API_URL.endsWith("/") ? API_URL : `${API_URL}/`;
    const fetchUrl = `${apiUrl}${workspaceId}/assistant/messages`;

    const body = {
        conversation_id: conversationId,
        role: "lawyer",
        content: message,
    };

    const response = await fetch(fetchUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        let errorMessage = "Error al enviar mensaje";
        try {
            const text = await response.text();
            if (text) {
                try {
                    const json = JSON.parse(text);
                    errorMessage = json.message || json.error || text;
                } catch {
                    errorMessage = text;
                }
            }
        } catch (e) {
            console.error("Error parsing error response:", e);
        }
        throw new Error(errorMessage);
    }

    if (response.body) {
        await processStreamResponse(response.body, onChunk);
    } else {
        throw new Error("No se pudo establecer la conexión de streaming");
    }
};

export const getAssistantMessages = async (
    workspaceId: string,
    conversationId: string
): Promise<MessageResponseItem[]> => {
    const { data } = await axiosInstance.get<ApiResponse<MessageResponseItem[]>>(
        `/${workspaceId}/assistant/messages/${conversationId}`
    );
    return data.data || [];
};

export const getAssistantConversations = async (
    workspaceId: string
): Promise<ConversationResponseData[]> => {
    const { data } = await axiosInstance.get<ApiResponse<ConversationResponseData[]>>(
        `/${workspaceId}/assistant/conversations`,
        {
            params: { limit: 100 },
        }
    );
    if (!data.data) {
        throw new Error("No se pudieron obtener las conversaciones");
    }
    return data.data;
};

export const updateTitleConversation = async (
    workspaceId: string,
    id: string,
    query: string
) => {
    await axiosInstance.patch<ApiResponse<void>>(
        `/${workspaceId}/assistant/conversations/${id}/title`,
        { query }
    );
};

export const deleteConversation = async (
    workspaceId: string,
    id: string
) => {
    await axiosInstance.delete<ApiResponse<void>>(
        `/${workspaceId}/assistant/conversations/${id}`
    );
};

export const getConversationById = async (
    workspaceId: string,
    id: string
): Promise<ConversationResponseData> => {
    const { data } = await axiosInstance.get<ApiResponse<ConversationResponseData>>(
        `/${workspaceId}/assistant/conversations/${id}`
    );
    if (!data.data) {
        throw new Error("No se pudo obtener la conversación");
    }
    return data.data;
};

export const updateConversation = async (
    workspaceId: string,
    id: string,
    title: string
): Promise<void> => {
    await axiosInstance.put<ApiResponse<void>>(
        `/${workspaceId}/assistant/conversations/${id}`,
        { title }
    );
};
