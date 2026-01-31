
import React, { useState, useEffect } from "react";
import { Briefcase, LogOut, Plus, Sparkles } from "lucide-react";
import { Button, Input, Skeleton } from "@/components/ui";
import { getWorkspaces, createWorkspace } from "@/modules/workspaces/services";

interface Workspace {
  id: string;
  public_id?: string;
  name: string;
}

import { useNavigate } from "react-router-dom";

export default function WorkspaceSelector() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const onLogout = () => {
    localStorage.removeItem("TOKEN_AUTH");
    navigate("/login");
  };

  const onWorkspaceSelected = (ws: Workspace) => {
    localStorage.setItem("CURRENT_WORKSPACE", JSON.stringify(ws));
    navigate(`/chat/nuevo`);
  };


  const fetchList = async () => {
    setIsLoading(true);
    try {
      const response = await getWorkspaces();
      setWorkspaces(response.data?.workspaces || []);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("401")) {
         onLogout();
      }
      setError("Error al cargar espacios de trabajo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    setIsCreating(true);
    setError("");
    try {
      await createWorkspace(newWorkspaceName);
      setNewWorkspaceName("");
      await fetchList();
    } catch (err: any) {
      setError(err.message || "Error al crear espacio.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center p-4 md:p-8 text-foreground font-sans">
      <div className="w-full max-w-2xl flex flex-col">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">Mis Espacios</h1>
            <p className="text-sm text-muted-foreground mt-1">Selecciona o crea un entorno de trabajo</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout} className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors">
            <LogOut size={20} />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex-1 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-4">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
              <div className="space-y-4">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id || ws.public_id}
                    onClick={() => onWorkspaceSelected(ws)}
                    className="w-full p-6 rounded-2xl border border-border/40 bg-card/40 hover:bg-card/60 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all text-left group relative overflow-hidden active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 transform group-hover:rotate-3">
                        <Briefcase size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xl text-foreground/90 group-hover:text-primary transition-colors">
                          {ws.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-semibold uppercase tracking-[0.15em] mt-1 flex items-center gap-2">
                          <span>Espacio de trabajo</span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span>Legal</span>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <Sparkles className="size-5 text-primary" />
                      </div>
                    </div>
                    {/* Decorative gradient */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-[80px] group-hover:bg-primary/10 transition-colors duration-500" />
                  </button>
                ))}
                {workspaces.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-24 bg-card/20 rounded-3xl border border-dashed border-border/40 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                        <Briefcase className="size-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-muted-foreground text-base font-medium">
                      No tienes espacios de trabajo.
                    </p>
                    <p className="text-[11px] text-muted-foreground/40 uppercase tracking-[0.2em] mt-2 font-bold">
                      Comienza creando uno abajo
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 mt-4 border-t border-border/40 bg-background/50 backdrop-blur-sm sticky bottom-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plus className="size-3 text-primary" />
                </div>
                <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Crear Nuevo Entorno
                </h3>
              </div>
              
              {error && (
                <div className="text-xs text-destructive mb-4 font-medium bg-destructive/5 p-3 rounded-xl border border-destructive/20 animate-in slide-in-from-top-2 duration-300 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-destructive animate-pulse" />
                  {error}
                </div>
              )}
              
              <form onSubmit={handleCreate} className="flex gap-3 mb-4">
                <Input
                  placeholder="Nombre del caso o despacho..."
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="flex-1 h-14 bg-card/40 border-border/40 focus-visible:ring-primary/20 rounded-2xl px-5 text-base transition-all"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!newWorkspaceName || isCreating}
                  className="h-14 w-14 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                  {isCreating ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent" />
                  ) : (
                    <Plus size={28} />
                  )}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
