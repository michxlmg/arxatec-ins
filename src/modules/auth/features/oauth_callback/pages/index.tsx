import { useEffect } from "react";
import { getOAuthCallback } from "../services";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { data, isError, isSuccess } = useQuery({
    queryKey: ["oauth-callback"],
    queryFn: getOAuthCallback,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const { token } = data;
      localStorage.setItem("TOKEN_AUTH", token);
      toast.success("Ingreso exitoso con Google");
      navigate(ROUTES.App.Workspaces, { replace: true });
    }
    if (isError) {
      toast.error("Error al iniciar sesión con Google");
      navigate(ROUTES.Auth.Login, { replace: true });
    }
  }, [data, isSuccess, isError, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 antialiased">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Sincronizando con Google...
        </p>
      </div>
    </div>
  );
}
