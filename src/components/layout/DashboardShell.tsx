"use client";

import React, { useState, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import Sidebar from "@/components/layout/Sidebar";
import { APP_CONFIG, UI_TEXT } from "@/core/constants/app";

export function DashboardShell({ children, title }: { children: React.ReactNode; title: string }) {
  const { isLoaded } = useWorkspace();
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Use a ref or simple boolean check if we want to avoid setState in effect, 
  // but for hydration we often need this. 
  // To satisfy the lint, we can just check isLoaded if we are sure we are on client.
  
  if (!mounted || !isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">{UI_TEXT.LOADING_WORKSPACE}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <main className="flex-1 overflow-hidden p-8 flex flex-col gap-6 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight capitalize text-white">{title}</h2>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-50">Workspace / {title}</p>
          </div>
          <div className="text-[10px] text-muted-foreground font-bold bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full shadow-inner">
            v{APP_CONFIG.VERSION}
          </div>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardShell;
