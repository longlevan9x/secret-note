"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ServiceTemplate } from "@/core/schema/types";

interface ServiceConfigFormProps {
  selectedTemplate: ServiceTemplate | null;
  serviceName: string;
  setServiceName: (name: string) => void;
  env: string;
  setEnv: (env: string) => void;
  description: string;
  setDescription: (desc: string) => void;
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
        <div className="space-y-3 pt-4 border-t">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Default Variables from {selectedTemplate.name}</Label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            {selectedTemplate.secretTemplates.map(t => (
              <div key={t.key} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                <span className="font-mono font-medium text-foreground/70">{t.key}</span>
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
