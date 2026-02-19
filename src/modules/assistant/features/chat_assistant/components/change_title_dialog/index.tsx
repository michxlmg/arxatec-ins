import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateConversation } from "../../services";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
  initialTitle: string;
  workspaceId: string;
}

export const ChangeTitleDialog: React.FC<Props> = ({
  open,
  setOpen,
  id,
  initialTitle,
  workspaceId,
}) => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateConversationMutate } = useMutation({
    mutationFn: (title: string) => updateConversation(workspaceId, id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistant-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["assistant-conversation", id] });
    },
  });
  const [title, setTitle] = useState(initialTitle);
  const [prevInitialTitle, setPrevInitialTitle] = useState(initialTitle);
  const [prevOpen, setPrevOpen] = useState(open);

  if (initialTitle !== prevInitialTitle || open !== prevOpen) {
    setPrevInitialTitle(initialTitle);
    setPrevOpen(open);
    setTitle(initialTitle);
  }

  const onSubmit = async () => {
    if (!title || title.trim() === "") return;
    toast.promise(updateConversationMutate(title), {
      success: "Título de la conversación actualizado.",
      error: "Error al actualizar el título de la conversación.",
      loading: "Actualizando título...",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar título</DialogTitle>
          <DialogDescription className="sr-only">
            Ingresa el nuevo título para esta conversación.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Ej. Consulta de Juan Pérez"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button size="sm" onClick={onSubmit}>
            Cambiar título
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
