import React from "react";
import { marked } from "marked";

interface Props {
  content: string;
}

export const Message: React.FC<Props> = ({ content }) => {
  return (
    <div className="flex space-x-3 items-start mb-4">
      <div className="flex-col flex-1">
        <div className="flex-1 min-w-0 flex justify-end">
          <div className="rounded-xl bg-primary/10 py-2 px-4 relative group w-fit max-w-[80%]">
            <div
              className="text-sm leading-relaxed prose prose-sm w-full max-w-full text-foreground"
              dangerouslySetInnerHTML={{
                __html: marked.parse(content) as string,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
