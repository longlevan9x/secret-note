"use client";

import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  Button
} from "@/client/components/ui";
import { 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Pencil, 
  Link as LinkIcon, 
  FolderOpen,
  Zap,
  Database,
  Cpu,
  Globe,
  Trash2
} from "lucide-react";

const PROVIDER_ICONS: Record<string, React.ReactNode> = {
  vercel: <Zap className="w-3.5 h-3.5 text-blue-400" />,
  supabase: <Database className="w-3.5 h-3.5 text-emerald-400" />,
  upstash: <Cpu className="w-3.5 h-3.5 text-primary" />,
};

const DEFAULT_PROVIDER_ICON = <Globe className="w-3.5 h-3.5 text-zinc-400" />;

interface SecretsTableProps {
  secrets: any[];
  visibleSecrets: Record<string, boolean>;
  copiedKey: string | null;
  onToggleVisibility: (id: string) => void;
  onCopy: (value: string, id: string) => void;
  onEdit: (secret: any) => void;
  onViewUsage: (secret: any) => void;
  onDelete: (projectId: string, secretKey: string) => void;
}

export function SecretsTable({
  secrets,
  visibleSecrets,
  copiedKey,
  onToggleVisibility,
  onCopy,
  onEdit,
  onViewUsage,
  onDelete
}: SecretsTableProps) {
  const getProviderIcon = (provider: string) => {
    return PROVIDER_ICONS[provider?.toLowerCase()] || DEFAULT_PROVIDER_ICON;
  };

  return (
    <div className="border border-zinc-800 rounded-2xl bg-zinc-950/50 overflow-hidden shadow-2xl">
      <Table>
        <TableHeader className="bg-zinc-900/50">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="w-[250px] text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Secret Identity</TableHead>
            <TableHead className="w-[180px] text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Project Context</TableHead>
            <TableHead className="w-[200px] text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Linked Services</TableHead>
            <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Value</TableHead>
            <TableHead className="w-[100px] text-right text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {secrets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-48 text-center text-muted-foreground italic text-sm">
                No secrets found matching the filters.
              </TableCell>
            </TableRow>
          ) : (
            secrets.map((secret) => {
              const uniqueId = `${secret.projectId}:${secret.key}`;
              const isVisible = visibleSecrets[uniqueId];
              return (
                <TableRow key={uniqueId} className="border-zinc-800 group hover:bg-zinc-900/40 transition-colors">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => onViewUsage(secret)}
                        className="text-left font-mono font-black text-white text-sm tracking-tight hover:text-primary transition-colors flex items-center gap-1.5 group/key"
                      >
                        {secret.key}
                        <LinkIcon className="w-3 h-3 opacity-0 group-hover/key:opacity-100 transition-opacity text-primary/50" />
                      </button>
                      {secret.note && <span className="text-[10px] text-zinc-500 italic max-w-[200px] truncate">{secret.note}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <FolderOpen className="w-3.5 h-3.5 text-primary/70" />
                      <span className="text-xs font-bold truncate max-w-[150px]">{secret.projectName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {secret.linkedServices.map((service: any) => (
                        <div key={service.id} className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter">
                          <div className="flex items-center justify-center scale-75 -ml-1">
                            {getProviderIcon(service.provider)}
                          </div>
                          <span className="text-zinc-400">{service.provider}</span>
                        </div>
                      ))}
                      {secret.linkedServices.length === 0 && (
                        <span className="text-[9px] text-zinc-600 italic">No Links</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex-1 px-3 h-9 flex items-center rounded bg-zinc-900/50 font-mono text-sm overflow-hidden border border-transparent group-hover:border-zinc-800/50 transition-all">
                        <span className={`truncate w-full ${isVisible ? "text-zinc-200" : "text-zinc-500"}`}>
                          {isVisible ? secret.value : "••••••••••••••••"}
                        </span>
                      </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleVisibility(uniqueId)}
                        className="h-8 w-8 hover:bg-zinc-800"
                      >
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onCopy(secret.value, uniqueId)}
                        className="h-8 w-8 hover:bg-zinc-800"
                      >
                        {copiedKey === uniqueId ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(secret)}
                        className="h-8 w-8 hover:bg-zinc-800"
                      >
                        <Pencil className="w-4 h-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(secret.projectId, secret.key)}
                        className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
