"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import { VaultLock } from "./VaultLock";
import { Onboarding } from "./Onboarding";
import { UI_TEXT } from "@/core/constants/app";

export function SecurityWrapper({ children }: { children: React.ReactNode }) {
  const { data, masterPassword, isLoaded } = useWorkspace();

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse font-medium">{UI_TEXT.LOADING_WORKSPACE}</p>
        </div>
      </div>
    );
  }

  // Case 1: First time setup (No validation hash)
  if (data && !data.validationHash) {
    return <Onboarding />;
  }

  // Case 2: Locked vault (Has hash but no password in memory)
  if (data?.validationHash && !masterPassword) {
    return <VaultLock />;
  }

  // Case 3: Unlocked or data not yet initialized
  return <>{children}</>;
}
