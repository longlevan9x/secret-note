"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Network, Settings, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { APP_CONFIG } from "@/core/constants/app";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { setMasterPassword } = useWorkspace();

  const menuItems = [
    { id: "projects", label: "Projects", icon: LayoutDashboard, href: "/projects" },
    { id: "graph", label: "Graph", icon: Network, href: "/graph" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ] as const;

  return (
    <div className={`border-r bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col p-4 gap-6 transition-all duration-300 relative ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <Button 
        variant="outline" 
        size="icon-xs" 
        className="absolute -right-3 top-20 rounded-full bg-background shadow-md z-10 hover:scale-110 transition-transform"
        onClick={onToggle}
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </Button>

      <Link href="/projects" className={`flex items-center gap-2 px-2 hover:opacity-80 transition-opacity ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shrink-0">
          SN
        </div>
        {!isCollapsed && <span className="font-bold text-xl tracking-tight truncate">{APP_CONFIG.NAME}</span>}
      </Link>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "animate-pulse" : ""}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t">
        <Button 
          variant="ghost" 
          title={isCollapsed ? "Lock Vault" : undefined}
          className={`w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors group cursor-pointer ${isCollapsed ? 'px-0 justify-center' : ''}`}
          onClick={() => setMasterPassword(null)}
        >
          <Lock className="w-4 h-4 transition-transform group-hover:rotate-12 shrink-0" />
          {!isCollapsed && <span className="truncate">Lock Vault</span>}
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
