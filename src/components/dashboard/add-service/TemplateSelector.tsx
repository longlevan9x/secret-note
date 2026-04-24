"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PREDEFINED_TEMPLATES } from "@/core/constants/templates";
import { ServiceTemplate } from "@/core/schema/types";
import { TemplateButton } from "./TemplateButton";

interface TemplateSelectorProps {
  onSelect: (template: ServiceTemplate | null) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <ScrollArea className="h-[500px] mt-6 rounded-md">
      <div className="grid grid-cols-3 gap-6 p-1">
        <TemplateButton 
          template={null} 
          onClick={() => onSelect(null)} 
        />
        
        {PREDEFINED_TEMPLATES.map((template) => (
          <TemplateButton 
            key={template.providerId}
            template={template}
            onClick={() => onSelect(template)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
