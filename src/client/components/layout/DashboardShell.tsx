"use client";

import React, { useState, useEffect } from "react";
import { useWorkspace } from "@/client/context/WorkspaceContext";
import Sidebar from "@/client/components/layout/Sidebar";
import { APP_CONFIG } from "@/shared/constants/app";

export function DashboardShell({ children, title }: { children: React.ReactNode; title: string }) {
  const { isLoaded } = useWorkspace();
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Initializing your secure workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* Sidebar - Fixed height via parent h-screen */}
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      
      {/* Main content area - Takes remaining width and forced h-screen */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300">
        {/* Top Header - Fixed at top */}
        <div className="p-8 pb-4 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight capitalize text-white">{title}</h2>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-40">Workspace / {title}</p>
          </div>
          <div className="text-[9px] text-muted-foreground font-black bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full shadow-inner tracking-widest uppercase">
            v{APP_CONFIG.VERSION}
          </div>
        </div>

        {/* Content Wrapper - This area can scroll if the children is taller than remaining space */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 min-h-0 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardShell;
