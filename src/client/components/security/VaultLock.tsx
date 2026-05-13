"use client";

import { useState } from "react";
import { useWorkspace } from "@/client/context/WorkspaceContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/client/components/ui/Card";
import { Input } from "@/client/components/ui/Input";
import { Button } from "@/client/components/ui/Button";
import { Lock, Unlock, ShieldAlert } from "lucide-react";
import { useToast } from "@/client/hooks/use-toast";
import { APP_CONFIG } from "@/shared/constants/app";

const MAX_ATTEMPTS = APP_CONFIG.SELF_DESTRUCT_MAX_ATTEMPTS;

export function VaultLock() {
  const { unlockVault, storageConfig } = useWorkspace();
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptsByVault, setAttemptsByVault] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const attemptsKey = `${APP_CONFIG.STORAGE_KEYS.VAULT_ATTEMPTS_PREFIX}${storageConfig.id}`;
  const attempts = attemptsByVault[attemptsKey] ?? (() => {
    if (typeof window === "undefined") return 0;
    const storedAttempts = parseInt(localStorage.getItem(attemptsKey) || "0", 10);
    return Number.isNaN(storedAttempts) ? 0 : storedAttempts;
  })();

  const handleSelfDestruct = () => {
    toast({
      title: "SECURITY ALERT: SELF-DESTRUCT",
      description: "Too many failed attempts. Clearing all local data.",
      variant: "destructive",
    });

    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }, APP_CONFIG.SELF_DESTRUCT_DELAY_MS);
  };

  const handleUnlock = async () => {
    setIsLoading(true);
    const success = await unlockVault(password);
    setIsLoading(false);
    
    if (success) {
      localStorage.removeItem(attemptsKey);
      setAttemptsByVault((prev) => ({ ...prev, [attemptsKey]: 0 }));
      toast({
        title: "Vault Unlocked",
        description: "Your secrets are now accessible.",
        variant: "success",
      });
    } else {
      const newAttempts = attempts + 1;
      localStorage.setItem(attemptsKey, newAttempts.toString());
      setAttemptsByVault((prev) => ({ ...prev, [attemptsKey]: newAttempts }));

      if (newAttempts >= MAX_ATTEMPTS) {
        handleSelfDestruct();
        return;
      }

      setIsError(true);
      setTimeout(() => setIsError(false), 500);
      toast({
        title: `Incorrect Password (${newAttempts}/${MAX_ATTEMPTS})`,
        description: newAttempts >= 3 ? "WARNING: Continuing will trigger self-destruct." : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-500">
      <Card className={`w-full max-w-md border-2 ${isError ? "border-destructive animate-shake" : "border-primary/20"} shadow-2xl shadow-primary/10 bg-zinc-900/90`}>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-white">System Login</CardTitle>
          <CardDescription>Please enter master password to access.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input 
              type="password" 
              placeholder="Master Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
              autoFocus
              className="h-12 bg-zinc-950 border-zinc-800 text-white text-center text-lg tracking-widest focus:ring-primary/50"
            />
          </div>
          <Button disabled={isLoading} onClick={handleUnlock} className="w-full h-12 text-lg font-bold gap-2 group">
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
               <Unlock className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
            {isLoading ? "Authenticating..." : "Access System"}
          </Button>

          {attempts > 0 && (
            <p className="text-center text-xs font-bold text-destructive animate-pulse">
              {MAX_ATTEMPTS - attempts} attempts remaining before self-destruct
            </p>
          )}
          
          <div className="pt-4 flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <ShieldAlert className="w-3 h-3" />
            Server-side Security: Authenticated via environment variables.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
