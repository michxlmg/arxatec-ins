import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { Ellipsis, PenLine, Trash2 } from "lucide-react";
import { useChatAssistant } from "../../context";
import { useState } from "react";
import { ChangeTitleDialog, DeleteConversationDialog } from "..";

interface Props {
  conversationId: string;
}

export const HeaderMessages: React.FC<Props> = ({ conversationId }) => {
  const { conversationTitle } = useChatAssistant();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const workspace = JSON.parse(localStorage.getItem("CURRENT_WORKSPACE") || "null");
  const workspaceId = workspace?.id || workspace?.public_id;

  return (
    <>
      <div className="sticky top-0 left-0 right-0 bg-background/80 backdrop-blur-md p-4 z-10 max-w-4xl mx-auto w-full flex items-center justify-center gap-2 border-b border-border/40">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <h2 className="text-sm font-medium">{conversationTitle}</h2>
              <Ellipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="gap-2" onClick={() => setOpenEdit(true)}>
              <PenLine className="size-4" />
              Editar título
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onClick={() => setOpenDelete(true)}
            >
              <Trash2 className="size-4" />
              Eliminar conversación
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ChangeTitleDialog
        open={openEdit}
        setOpen={setOpenEdit}
        id={conversationId}
        initialTitle={conversationTitle}
        workspaceId={workspaceId}
      />
      <DeleteConversationDialog
        open={openDelete}
        setOpen={setOpenDelete}
        id={conversationId}
        workspaceId={workspaceId}
      />
    </>
  );
};
