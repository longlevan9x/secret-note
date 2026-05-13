"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/client/components/ui/Button";
import { ServiceTemplate } from "@/shared/schema/types";

interface TemplateButtonProps {
  template: ServiceTemplate | null;
  onClick: () => void;
}

export function TemplateButton({ template, onClick }: TemplateButtonProps) {
  const [imgError, setImgError] = useState(false);
  
  if (!template) {
    return (
      <Button 
        variant="outline" 
        className="h-36 flex flex-col items-center justify-center gap-3 border-dashed hover:border-primary hover:bg-primary/5 transition-all active:scale-95 shadow-sm"
        onClick={onClick}
      >
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-muted">
          <span className="text-2xl">+</span>
        </div>
        <span className="font-bold text-lg">Custom Service</span>
        <span className="text-sm text-muted-foreground font-normal text-center">Start from scratch</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="h-36 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all active:scale-95 group shadow-sm"
      onClick={onClick}
    >
      {template.icon && !imgError ? (
        <div className="w-12 h-12 flex items-center justify-center">
          <Image 
            src={`https://cdn.simpleicons.org/${template.icon}`} 
            alt={template.name} 
            width={48}
            height={48}
            className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
            unoptimized
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl">
          {template.name[0]}
        </div>
      )}
      <div className="flex flex-col items-center gap-0.5">
        <span className="font-bold text-lg">{template.name}</span>
        <span className="text-sm text-muted-foreground font-normal">{template.secretTemplates.length} variables</span>
      </div>
    </Button>
  );
}
