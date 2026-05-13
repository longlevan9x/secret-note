"use client";

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  Button,
  Badge
} from "@/client/components/ui";
import { Link as LinkIcon, FolderOpen, Server, ExternalLink, Info, Zap, Database, Cpu, Globe } from "lucide-react";

interface UsageExplorerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  secret: any;
  onViewServiceDetail: (service: any, projectId: string) => void;
  onGoToProject: (projectId: string) => void;
}

export function UsageExplorerDialog({
  isOpen,
  onOpenChange,
  secret,
  onViewServiceDetail,
  onGoToProject
}: UsageExplorerDialogProps) {
  const getProviderIcon = (provider: string) => {
    switch (provider?.toLowerCase()) {
      case 'vercel': return <Zap className="w-3.5 h-3.5 text-blue-400" />;
      case 'supabase': return <Database className="w-3.5 h-3.5 text-emerald-400" />;
      case 'upstash': return <Cpu className="w-3.5 h-3.5 text-primary" />;
      default: return <Globe className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  if (!secret) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white overflow-hidden p-0 shadow-2xl">
        <div className="p-6 space-y-6">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <LinkIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black tracking-tight">Usage Explorer</DialogTitle>
                <p className="text-xs text-zinc-500 font-mono mt-1">{secret.key}</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-2">
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <FolderOpen className="w-3 h-3" />
                Primary Project
              </h4>
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 group hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-bold text-sm">{secret.projectName}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 gap-1.5 text-xs hover:bg-zinc-800"
                  onClick={() => onGoToProject(secret.projectId)}
                >
                  Go to Dashboard
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Server className="w-3 h-3" />
                Linked Services ({secret.linkedServices.length})
              </h4>
              <div className="grid gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                {secret.linkedServices.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl">
                    <p className="text-xs text-zinc-600 italic">This secret is not linked to any services yet.</p>
                  </div>
                ) : (
                  secret.linkedServices.map((service: any) => (
                    <div key={service.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50 group/item hover:bg-zinc-900/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded bg-zinc-950 border border-zinc-800 group-hover/item:border-zinc-700 transition-colors">
                          {getProviderIcon(service.provider)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-zinc-200">{service.name}</span>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-tighter">{service.provider} • {service.env}</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-500 hover:text-primary hover:bg-primary/10"
                        onClick={() => onViewServiceDetail(service, secret.projectId)}
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 px-6 border-zinc-800 hover:bg-zinc-800 font-bold text-xs">
            Close Explorer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
