"use client";

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/client/components/ui/Dialog";
import { Badge } from "@/client/components/ui/Badge";
import { Button } from "@/client/components/ui/Button";
import { ScrollArea } from "@/client/components/ui/ScrollArea";
import { Zap, Database, Cpu, Globe, Key } from "lucide-react";
import type { ServiceNode } from "@/shared/schema/types";
import type { ServiceQuickViewContext } from "./types";

interface ServiceQuickViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceNode | null;
  projectContext: ServiceQuickViewContext;
}

export function ServiceQuickViewDialog({
  isOpen,
  onOpenChange,
  service,
  projectContext
}: ServiceQuickViewDialogProps) {
  const getProviderIcon = (provider?: string) => {
    switch (provider?.toLowerCase()) {
      case 'vercel': return <Zap className="w-3.5 h-3.5 text-blue-400" />;
      case 'supabase': return <Database className="w-3.5 h-3.5 text-emerald-400" />;
      case 'upstash': return <Cpu className="w-3.5 h-3.5 text-primary" />;
      default: return <Globe className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-zinc-950 border-zinc-800 text-white p-0 overflow-hidden shadow-2xl">
        <div className="p-6 space-y-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-inner">
                  {getProviderIcon(service.provider)}
                </div>
                <div>
                  <DialogTitle className="text-lg font-black tracking-tight">{service.name}</DialogTitle>
                  <Badge variant="zinc" className="text-[9px] font-mono mt-1 h-5">{service.provider} Provider</Badge>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black italic px-3 py-1">
                {service.env}
              </Badge>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-6">
              {service.description && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Description</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-900/30 p-3 rounded-lg border border-zinc-800/50">
                    {service.description}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Key className="w-3 h-3 text-primary" />
                  Environment Variables
                </h4>
                <div className="grid gap-1.5">
                  {service.secretKeys?.length === 0 ? (
                    <p className="text-[11px] text-zinc-600 italic ml-1">No environment variables linked.</p>
                  ) : (
                    service.secretKeys?.map((key: string) => (
                      <div key={key} className="flex items-center gap-2 py-1.5 px-3 rounded bg-zinc-900/50 border border-zinc-800/30 font-mono text-[11px] text-zinc-300">
                        <div className="w-1 h-1 rounded-full bg-primary/50" />
                        {key}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-blue-400" />
                  Infrastructure Links
                </h4>
                <div className="grid gap-2">
                  {service.dependsOn?.length === 0 ? (
                    <p className="text-[11px] text-zinc-600 italic ml-1">No direct infrastructure dependencies.</p>
                  ) : (
                    service.dependsOn?.map((depId: string) => {
                      const dep = projectContext?.nodes.find((n) => n.id === depId);
                      return (
                        <div key={depId} className="flex items-center gap-3 p-2.5 rounded bg-blue-500/5 border border-blue-500/10">
                          {getProviderIcon(dep?.provider)}
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-blue-100">{dep?.name || 'Unknown Service'}</span>
                            <span className="text-[9px] text-blue-400/70 font-mono uppercase tracking-tighter">{dep?.provider}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex justify-between items-center px-6">
          <span className="text-[9px] text-zinc-500 italic">Project: {projectContext?.name}</span>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="h-8 px-5 border-zinc-800 hover:bg-zinc-800 font-bold text-[10px] uppercase tracking-wider"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
