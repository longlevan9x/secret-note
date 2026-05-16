"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Folder, Zap } from "lucide-react";
import { Dialog, DialogContent } from "@/client/components/ui/Dialog";
import { Input } from "@/client/components/ui/Input";
import { ScrollArea } from "@/client/components/ui/ScrollArea";
import { useWorkspace } from "@/client/context/WorkspaceContext";
import type { Project, ServiceNode } from "@/shared/schema/types";

type SearchableService = ServiceNode & { projectName: string };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data } = useWorkspace();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const results = useMemo((): { projects: Project[]; services: SearchableService[] } => {
    const projects = data?.projects ?? [];
    const normalizedQuery = query.toLowerCase();

    return {
      projects: projects
        .filter((project) => project.name.toLowerCase().includes(normalizedQuery))
        .slice(0, 3),
      services: projects
        .flatMap((project) => project.nodes.map((service) => ({ ...service, projectName: project.name })))
        .filter(
          (service) =>
            service.name.toLowerCase().includes(normalizedQuery) ||
            service.provider.toLowerCase().includes(normalizedQuery)
        )
        .slice(0, 8),
    };
  }, [data?.projects, query]);

  if (!data) return null;

  const handleSelect = (serviceId?: string) => {
    // We would need a way to trigger navigation/selection globally
    // For now, we can use window events or a dedicated method in WorkspaceContext
    if (serviceId) {
      window.dispatchEvent(new CustomEvent("select-service", { detail: serviceId }));
    }
    setOpen(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent size="lg" className="p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <div className="flex items-center border-b px-4 py-3 bg-muted/30">
          <Search className="mr-2 h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full border-none bg-transparent p-0 focus-visible:ring-0 text-base"
            autoFocus
          />
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">ESC</span>
          </kbd>
        </div>
        
        <ScrollArea className="max-h-[400px]">
          <div className="p-2">
            {query.length > 0 && results.projects.length === 0 && results.services.length === 0 && (
              <div className="py-14 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            )}

            {results.projects.length > 0 && (
              <div className="px-2 py-2">
                <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  Projects
                </p>
                <div className="space-y-1">
                  {results.projects.map((project: Project) => (
                    <button
                      key={project.id}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors text-left group"
                      onClick={() => handleSelect()}
                    >
                      <Folder className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      <span className="font-medium">{project.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.services.length > 0 && (
              <div className="px-2 py-2">
                <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  Services & Secrets
                </p>
                <div className="space-y-1">
                  {results.services.map((service) => (
                    <button
                      key={service.id}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors text-left group"
                      onClick={() => handleSelect(service.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Zap className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        <div className="flex flex-col">
                          <span className="font-medium">{service.name}</span>
                          <span className="text-[10px] text-muted-foreground group-hover:text-primary/70">{service.provider} • {service.projectName}</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary uppercase font-bold">
                        {service.env}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex items-center justify-between border-t bg-muted/50 px-4 py-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-background px-1">↑↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-background px-1">Enter</kbd> to select
            </span>
          </div>
          <span>Secret Note v0.1.0</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
