import React from "react";
import { marked } from "marked";
import { Loader2 } from "lucide-react";

interface Props {
  content: string;
}

export const MessageAssistant: React.FC<Props> = ({ content }) => {
  return (
    <div className="flex space-x-3 items-start mb-4">
      <div className="flex-col flex-1">
        <div className="flex-1 min-w-0">
          <div className="rounded-xl relative group max-w-[80%]">
            {content === "Pensando..." ? (
              <div className="text-sm leading-relaxed flex items-center justify-start gap-2 text-muted-foreground py-2">
                <Loader2 className="size-4 animate-spin" />
                <span className="animate-pulse">Pensando...</span>
              </div>
            ) : (
              <div
                className="text-sm leading-relaxed prose prose-sm w-full max-w-full text-foreground"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(content) as string,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
