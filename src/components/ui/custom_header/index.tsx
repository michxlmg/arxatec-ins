import React from "react";

interface CustomHeaderProps {
  title: string;
  description: string;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ title, description }) => (
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
