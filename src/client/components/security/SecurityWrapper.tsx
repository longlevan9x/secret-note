"use client";

import { useWorkspace } from "@/client/context/WorkspaceContext";
import { VaultLock } from "./VaultLock";
import { PrivacyShield } from "./PrivacyShield";


export function SecurityWrapper({ children }: { children: React.ReactNode }) {
  const { data, masterPassword, isLoaded } = useWorkspace();

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // If no password in memory (not logged in) -> Always show Login screen (VaultLock)
  if (!masterPassword) {
    return <VaultLock />;
  }

  // Login successful
  return <PrivacyShield>{children}</PrivacyShield>;
}
