"use client";

import React from "react";
import { Button } from "@/client/components/ui/Button";
import { Input } from "@/client/components/ui/Input";
import { Label } from "@/client/components/ui/Label";
import { Textarea } from "@/client/components/ui/Textarea";
import { ServiceTemplate } from "@/shared/schema/types";

interface ServiceConfigFormProps {
  selectedTemplate: ServiceTemplate | null;
  serviceName: string;
  setServiceName: (name: string) => void;
  env: string;
  setEnv: (env: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  initialSecrets: Record<string, string>;
  setInitialSecrets: (secrets: Record<string, string>) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function ServiceConfigForm({
  selectedTemplate,
  serviceName,
  setServiceName,
  env,
  setEnv,
  description,
  setDescription,
  initialSecrets,
  setInitialSecrets,
  onBack,
  onSubmit
}: ServiceConfigFormProps) {
  return (
    <div className="space-y-6 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base font-bold">Project Name (Custom)</Label>
        <Input 
          id="name" 
          value={serviceName} 
          onChange={e => setServiceName(e.target.value)} 
          placeholder="e.g. project-xxx, my-app-db, etc."
          className="h-12 text-lg font-medium border-2 focus-visible:ring-primary/20"
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          This name will be used as the primary label in your dashboard.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="env">Environment</Label>
          <Input 
            id="env" 
            value={env} 
            onChange={e => setEnv(e.target.value)} 
            placeholder="e.g. Production"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label>Provider / Template</Label>
          <div className="h-11 flex items-center px-3 rounded-md bg-muted/50 text-sm font-medium border border-border/50">
            {selectedTemplate ? selectedTemplate.name : "Custom Service"}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="What is this service for?"
          className="resize-none min-h-[80px]"
        />
      </div>

      {selectedTemplate && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Template Variables</Label>
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Will be encrypted</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {selectedTemplate.secretTemplates.map(t => (
              <div key={t.key} className="space-y-1.5 group">
                <Label htmlFor={`secret-${t.key}`} className="text-xs font-mono text-foreground/70 group-hover:text-primary transition-colors">
                  {t.key}
                </Label>
                <Input 
                  id={`secret-${t.key}`}
                  type="password"
                  placeholder={`Value for ${t.key}...`}
                  value={initialSecrets[t.key] || ""}
                  onChange={(e) => setInitialSecrets({
                    ...initialSecrets,
                    [t.key]: e.target.value
                  })}
                  className="h-10 font-mono text-sm border-muted-foreground/20 focus-visible:border-primary/50 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" className="h-11 px-6" onClick={onBack}>Back</Button>
        <Button 
          className="h-11 px-10 font-bold text-base shadow-lg shadow-primary/20" 
          onClick={onSubmit} 
          disabled={!serviceName.trim()}
        >
          Create Service
        </Button>
      </div>
    </div>
  );
}
