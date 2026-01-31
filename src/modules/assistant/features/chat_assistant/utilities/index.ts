import type { AssistantMessage } from "../types";

export const mergeMessages = (
    serverMessages: AssistantMessage[],
    optimisticMessages: AssistantMessage[]
): AssistantMessage[] => {
    // Create a Set of server message IDs for quick lookup
    const serverIds = new Set(serverMessages.map((m) => m.id));

    // Filter out optimistic messages that already exist on the server
    // Also filter out temporary IDs that start with "temp-"
    const uniqueOptimistic = optimisticMessages.filter((m) => {
        // If it's a temp message and we have server messages, it's likely been replaced
        if (m.id.startsWith("temp-") && serverMessages.length > 0) {
            // Check if there's a similar message from the server (same content and role)
            const hasServerEquivalent = serverMessages.some(
                (sm) => sm.sent_by === m.sent_by && sm.content.includes(m.content.substring(0, 50))
            );
            if (hasServerEquivalent) return false;
        }

        return !serverIds.has(m.id);
    });

    // Combine and sort by timestamp
    return [...serverMessages, ...uniqueOptimistic].sort(
        (a, b) => a.created_at.getTime() - b.created_at.getTime()
    );
};
