import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Global UI Components matching Arxatec (Shadcn style)
const Button = ({
  className,
  variant = "default",
  size = "default",
  ...props
}) => {
  const variants = {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    outline:
      "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 text-xs",
    lg: "h-10 px-8",
    icon: "h-9 w-9",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
};

const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-input/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
      className,
    )}
    {...props}
  />
);

const Label = ({ className, ...props }) => (
  <label
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground/90",
      className,
    )}
    {...props}
  />
);

const Header = ({ title, description }) => (
  <div className="flex flex-col gap-2 text-center mb-2">
    <div className="flex justify-center mb-4">
      <div className="w-full p-2 rounded-md bg-primary/5 flex items-center justify-center">
        <img
          src="/assets/logo.png"
          alt="Arxatec Logo"
          className="h-12 filter brightness-110"
        />
      </div>
    </div>

    <h1 className="text-2xl font-bold font-serif tracking-tight text-foreground">
      {title}
    </h1>

    <p className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
      {description}
    </p>
  </div>
);

const ChatMessage = ({ role, content, time }) => {
  const isUser = role === "user";
  const name = isUser ? "Dr. Robert" : "Asistente";

  return (
    <div className="flex flex-col gap-1.5 mb-6 max-w-[95%] items-start">
      {/* Header: Name and Time */}
      <div className="flex items-baseline gap-2 px-1 text-[11px] font-medium tracking-tight">
        <span
          className={cn(
            "text-foreground/90",
            isUser ? "text-primary/90" : "text-foreground/90",
          )}
        >
          {name}
        </span>
        <span className="text-muted-foreground/60 font-normal italic">
          {time}
        </span>
      </div>

      {/* Message Bubble - All on the left */}
      <div
        className={cn(
          "p-3.5 rounded-2xl rounded-tl-none text-[13.5px] leading-relaxed border transition-all",
          isUser
            ? "bg-primary/10 border-primary/20 text-foreground"
            : "bg-secondary/40 border-border/40 text-foreground/90 backdrop-blur-sm",
        )}
      >
        {content}
      </div>
    </div>
  );
};

const Chatbot = ({ onBack }) => {
  const getCurrentTime = () => {
    const now = new Date();
    return (
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0")
    );
  };

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hola, soy tu asistente legal de Arxatec. ¿En qué puedo ayudarte con tu documento de Word hoy?",
      time: "09:00",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const time = getCurrentTime();
    const newMessages = [
      ...messages,
      { role: "user", content: inputValue, time },
    ];
    setMessages(newMessages);
    setInputValue("");

    // Simulación de respuesta
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Entiendo perfectamente su consulta, Dr. Robert. Estoy analizando los precedentes legales y la normativa vigente para asistirle con la redacción.",
          time: getCurrentTime(),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat Header */}
      <div className="p-4 border-b border-border flex items-center gap-3 bg-card/30 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={onBack} className="size-8">
          <span className="text-xl">←</span>
        </Button>
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <img
              src="/assets/logo.png"
              className="h-4 filter brightness-110"
              alt="Logo"
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold leading-none">
              Asistente Arxatec
            </h2>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <ChatMessage key={i} {...msg} />
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            placeholder="Escribe tu mensaje aquí..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-card/50"
          />
          <Button type="submit" size="icon" className="shrink-0 bg-primary">
            <span className="text-lg">→</span>
          </Button>
        </form>
        <p className="text-[9px] text-center text-muted-foreground mt-3 uppercase tracking-widest">
          Potenciado por IA Legal Arxatec
        </p>
      </div>
    </div>
  );
};

function App() {
  const [view, setView] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setView("chatbot");
    }, 1500);
  };

  if (view === "chatbot") {
    return <Chatbot onBack={() => setView("login")} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 antialiased selection:bg-primary/30">
      <div className="w-full max-w-[350px] flex flex-col gap-8">
        <Header
          title="Ingresar a mi cuenta"
          description="Ingresa tus credenciales para acceder a la plataforma legal de Arxatec."
        />

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ej.correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <a
                href="https://abogado.arxatec.net/recuperar-cuenta"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ej.cfaWR252$Mja"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground tracking-widest">
                  O ingresa con
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              onClick={() =>
                (window.location.href =
                  "https://abogado.arxatec.net/api/auth/login/google")
              }
              className="w-full h-11 border-border/50 bg-card/50"
            >
              <svg
                className="mr-2 h-4 w-4"
                viewBox="0 0 488 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Ingresa con Google
            </Button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">¿No tienes una cuenta?</span>{" "}
          <button
            onClick={() => setView("chatbot")}
            className="font-semibold text-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
