"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PREDEFINED_TEMPLATES } from "@/core/constants/templates";
import { ServiceTemplate } from "@/core/schema/types";
import { TemplateButton } from "./TemplateButton";
import { useWorkspace } from "@/context/WorkspaceContext";
import { CustomTemplateDialog } from "./CustomTemplateDialog";

interface TemplateSelectorProps {
  onSelect: (template: ServiceTemplate | null) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const { data } = useWorkspace();
  const customTemplates = data?.customTemplates || [];

  return (
    <ScrollArea className="h-[500px] mt-6 rounded-md pr-4">
      <div className="space-y-8">
        {/* Custom Templates Section */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 px-1">Your Templates</h4>
          <div className="grid grid-cols-3 gap-6 p-1">
            <TemplateButton 
              template={null} 
              onClick={() => onSelect(null)} 
            />
            {customTemplates.map((template) => (
              <TemplateButton 
                key={template.providerId}
                template={template}
                onClick={() => onSelect(template)}
              />
            ))}
            <CustomTemplateDialog />
          </div>
        </div>

        {/* Predefined Templates Section */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Global Library</h4>
          <div className="grid grid-cols-3 gap-6 p-1">
            {PREDEFINED_TEMPLATES.map((template) => (
              <TemplateButton 
                key={template.providerId}
                template={template}
                onClick={() => onSelect(template)}
              />
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
