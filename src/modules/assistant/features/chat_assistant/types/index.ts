export type AssistantActor = "assistant" | "lawyer";

export interface AssistantMessage {
    id: string;
    content: string;
    sent_by: AssistantActor;
    created_at: Date;
}

export interface ConversationResponseData {
    id: string;
    title: string | null;
    created_at: string;
    updated_at: string;
}

export interface MessageResponseItem {
    id: string;
    content: string;
    role: AssistantActor;
    created_at: string;
    case_id?: string;
}
