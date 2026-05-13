"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button } from "@/client/components/ui";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Secret } from "@/shared/schema/types";

interface SecretTableProps {
  secrets: Secret[];
  visibleSecrets: Record<string, boolean>;
  toggleVisibility: (key: string) => void;
  handleEditSecret: (secret: Secret) => void;
  setConfirmDelete: (state: { type: "service" | "secret"; key?: string } | null) => void;
}

export function SecretTable({
  secrets,
  visibleSecrets,
  toggleVisibility,
  handleEditSecret,
  setConfirmDelete,
}: SecretTableProps) {
  return (
    <div className="border border-zinc-800 rounded-xl bg-zinc-950/50 overflow-hidden shadow-2xl">
      <Table>
        <TableHeader className="bg-zinc-900/50">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="w-[250px] text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Variable Name</TableHead>
            <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Secret Value</TableHead>
            <TableHead className="w-[100px] text-right text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {secrets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-32 text-center text-muted-foreground italic">
                No secrets stored for this service.
              </TableCell>
            </TableRow>
          ) : (
            secrets.map((secret) => (
              <TableRow key={secret.key} className="border-zinc-800 group hover:bg-zinc-900/40 transition-colors">
                <TableCell className="font-mono text-sm text-zinc-300">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-white">{secret.key}</span>
                    {secret.note && <span className="text-[10px] text-zinc-500 italic">{secret.note}</span>}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 h-9 flex items-center rounded bg-zinc-900/50 font-mono text-sm transition-all duration-300 overflow-hidden border border-transparent group-hover:border-zinc-800/50">
                      <span className={`truncate w-full ${visibleSecrets[secret.key] ? "text-zinc-200" : "text-zinc-500"}`}>
                        {visibleSecrets[secret.key] ? secret.value : "••••••••••••••••"}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => toggleVisibility(secret.key)}
                      className="h-8 w-8 hover:bg-zinc-800"
                    >
                      {visibleSecrets[secret.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => handleEditSecret(secret)} className="h-8 w-8">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setConfirmDelete({ type: "secret", key: secret.key })} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
