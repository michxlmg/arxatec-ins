import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { createQueryClient } from "@/utilities";
import { Toaster } from "@/components/ui";

interface Props {
  children: React.ReactNode;
}

export default function Core({ children }: Props) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased">
        {children}
      </div>
      <Toaster visibleToasts={1} expand={false} position="top-right" />
    </QueryClientProvider>
  );
}
