import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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

  const onSubmit = async () => {
    if (!title || title.trim() === "") return;
    toast.promise(updateConversationMutate(title), {
      success: "Título de la conversación actualizado.",
      error: "Error al actualizar el título de la conversación.",
      loading: "Actualizando título...",
    });
    setOpen(false);
  };

  useEffect(() => {
    setTitle(initialTitle);
  }, [open, initialTitle]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar título</DialogTitle>
          <Input
            placeholder="Ej. Consulta de Juan Pérez"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-4"
          />
          <DialogFooter className="mt-2">
            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={onSubmit}>
              Cambiar título
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
