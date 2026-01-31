import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Plus, PenLine, Trash2, Ellipsis, LogOut, SquarePen, Briefcase } from "lucide-react";
import { Button, Skeleton, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui";
import { cn } from "@/utilities";
import { getAssistantConversations } from "@/modules/assistant/features/chat_assistant/services";
import { useNavigate, useParams } from "react-router-dom";
import type { ConversationResponseData } from "@/modules/assistant/features/chat_assistant/types";
import { ChangeTitleDialog, DeleteConversationDialog } from "@/modules/assistant/features/chat_assistant/components";

interface HistorySidebarProps {
    workspaceId: string;
    onClose?: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ workspaceId, onClose }) => {
    const navigate = useNavigate();
    const { id: activeId } = useParams();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedTitle, setSelectedTitle] = useState<string>("");
    const [openChangeTitle, setOpenChangeTitle] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const workspace = JSON.parse(localStorage.getItem("CURRENT_WORKSPACE") || "null");

    const { data, isLoading } = useQuery({
        queryKey: ["assistant-conversations", workspaceId],
        queryFn: () => getAssistantConversations(workspaceId),
        enabled: !!workspaceId,
        staleTime: 0, // Always refetch to get latest data
        refetchOnMount: true, // Refetch when component mounts
    });

    const conversations = data?.conversations || [];

    const navigateToConversation = (conversationId: string) => {
        navigate(`/chat/${conversationId}`);
        if (onClose) onClose();
    };

    const handleLogout = () => {
        localStorage.removeItem("TOKEN_AUTH");
        localStorage.removeItem("CURRENT_WORKSPACE");
        navigate("/login");
    };

    return (
        <div className="flex flex-col h-full bg-card">
            {/* Workspace Header */}
            <div className="p-4 border-b border-border/50">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <p className="text-sm font-semibold truncate">{workspace?.name}</p>
                                <p className="text-xs text-muted-foreground">Espacio de trabajo</p>
                            </div>
                            <Ellipsis className="h-4 w-4 shrink-0" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuItem onClick={() => navigate("/workspaces")}>
                            <Briefcase className="h-4 w-4 mr-2" />
                            Cambiar espacio
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/workspaces")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Crear nuevo espacio
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* New Consultation Button */}
            <div className="p-4 border-b border-border/50">
                <Button 
                    className="w-full justify-start gap-2"
                    variant={activeId === "nuevo" ? "secondary" : "ghost"}
                    onClick={() => {
                        navigate(`/chat/nuevo`);
                        if (onClose) onClose();
                    }}
                >
                    <SquarePen className="h-4 w-4" />
                    Nueva consulta
                </Button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
                {isLoading ? (
                    <div className="space-y-1 mt-2">
                        {Array(5).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-9 w-full" />
                        ))}
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No hay historial</p>
                    </div>
                ) : (
                    <>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 mt-4">
                            Mis consultas
                        </p>
                        {conversations.map((conv: ConversationResponseData) => (
                            <div
                                key={conv.id}
                                className={cn(
                                    "relative w-full items-center justify-between group mb-1",
                                    activeId === conv.id && "bg-accent text-accent-foreground rounded-md"
                                )}
                            >
                                <button
                                    onClick={() => navigateToConversation(conv.id)}
                                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                >
                                    {conv.title || "Nueva consulta"}
                                </button>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="size-7 group-hover:opacity-100 opacity-0 transition-opacity duration-300"
                                                onClick={(e: React.MouseEvent) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <Ellipsis className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setSelectedId(conv.id);
                                                    setSelectedTitle(conv.title || "");
                                                    setOpenChangeTitle(true);
                                                }}
                                            >
                                                <PenLine className="size-4 mr-2" />
                                                Editar título
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setSelectedId(conv.id);
                                                    setOpenDelete(true);
                                                }}
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="size-4 mr-2" />
                                                Eliminar conversación
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Footer - Logout */}
            <div className="p-4 border-t border-border/50">
                <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                </Button>
            </div>

            {/* Dialogs */}
            <ChangeTitleDialog
                open={openChangeTitle}
                setOpen={setOpenChangeTitle}
                id={selectedId ?? ""}
                initialTitle={selectedTitle}
                workspaceId={workspaceId}
            />
            <DeleteConversationDialog
                open={openDelete}
                setOpen={setOpenDelete}
                id={selectedId ?? ""}
                workspaceId={workspaceId}
            />
        </div>
    );
};
