import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { deleteConversation } from "../../services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
  workspaceId: string;
}

export const DeleteConversationDialog: React.FC<Props> = ({
  open,
  setOpen,
  id,
  workspaceId,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: deleteConversationMutate } = useMutation({
    mutationFn: () => deleteConversation(workspaceId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistant-conversations"] });
      navigate(`/chat/nuevo`);
    },
  });

  const onSubmit = async () => {
    toast.promise(deleteConversationMutate(), {
      success: "Conversación eliminada.",
      error: "Error al eliminar la conversación.",
      loading: "Eliminando conversación...",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar conversación</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de querer eliminar esta conversación? Esta acción no
            puede ser deshecha.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button size="sm" variant="destructive" onClick={onSubmit}>
            Eliminar conversación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
