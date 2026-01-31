import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-background">
      {/* Left side - Decorative/Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-card relative overflow-hidden border-r border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
        <div className="relative z-10 max-w-lg text-center">
         
            <h1 className="text-5xl font-serif font-bold tracking-tight mb-6">
                Tu asistente legal <span className="text-primary italic">inteligente</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
                Optimiza tus consultas legales con el poder de la IA avanzada, diseñada específicamente para profesionales del derecho.
            </p>
        </div>
        
        {/* Subtle decorative elements */}
        <div className="absolute -bottom-24 -left-24 h-96 w-96 bg-primary/20 rounded-full blur-[120px] opacity-20" />
        <div className="absolute -top-24 -right-24 h-96 w-96 bg-primary/20 rounded-full blur-[120px] opacity-20" />
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col justify-center items-center p-6 md:p-12 relative">
        {/* Mobile Logo/Brand */}
        <div className="lg:hidden absolute top-8 text-center w-full">
            <h1 className="text-2xl font-serif font-bold">Arxatec</h1>
        </div>
        
        <div className="w-full max-w-[400px]">
          <Outlet />
        </div>
        
        <footer className="absolute bottom-8 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Arxatec. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}
