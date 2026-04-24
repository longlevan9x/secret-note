"use client";

import React, { useState, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { APP_CONFIG, UI_TEXT } from "@/core/constants/app";

export function DashboardShell({ children, title }: { children: React.ReactNode; title: string }) {
  const { isLoaded, masterPassword, setMasterPassword } = useWorkspace();
  const [passwordInput, setPasswordInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return <div className="flex h-screen items-center justify-center font-medium text-muted-foreground">{UI_TEXT.LOADING_WORKSPACE}</div>;
  }

  if (!masterPassword) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{APP_CONFIG.NAME}</CardTitle>
            <CardDescription>{UI_TEXT.UNLOCK_VAULT}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="password"
              placeholder="Master Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setMasterPassword(passwordInput)}
              className="h-11"
              autoFocus
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full h-11 font-semibold" onClick={() => setMasterPassword(passwordInput)}>
              Unlock Vault
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <main className="flex-1 overflow-hidden p-8 flex flex-col gap-6 transition-all duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight capitalize">{title}</h2>
          <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">v{APP_CONFIG.VERSION}</div>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardShell;
