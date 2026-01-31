import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group toast p-4 transition-all duration-300 border border-border/50 bg-card/80 backdrop-blur-xl flex gap-2 rounded-xl shadow-lg shadow-black/5",
          title:
            "text-base font-bold font-serif leading-4",
          description: "text-xs opacity-70 font-sans",
          error:
            "text-destructive-foreground bg-destructive border-destructive/20",
          success:
            "text-primary-foreground bg-primary border-primary/20",
          warning:
            "text-orange-500 bg-orange-500/10 border-orange-500/20",
          info: "text-blue-500 bg-blue-500/10 border-blue-500/20",
          loading:
            "bg-card/90 gap-2",
          loader: "text-primary",
          icon: "text-sm self-start flex h-full",
          actionButton: "bg-primary text-primary-foreground font-medium rounded-md px-2 py-1",
          cancelButton: "bg-transparent text-foreground underline",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
