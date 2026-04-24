"use client";

import { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function VaultLock() {
  const { unlockVault } = useWorkspace();
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  const handleUnlock = () => {
    const success = unlockVault(password);
    if (success) {
      toast({
        title: "Vault Unlocked",
        description: "Your secrets are now accessible.",
        variant: "success",
      });
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
      toast({
        title: "Incorrect Password",
        description: "Please try again.",
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
          <CardTitle className="text-2xl font-black tracking-tight text-white">Vault Locked</CardTitle>
          <CardDescription>Enter your Master Password to access your workspace.</CardDescription>
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
          <Button onClick={handleUnlock} className="w-full h-12 text-lg font-bold gap-2 group">
            <Unlock className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Unlock Workspace
          </Button>
          
          <div className="pt-4 flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <ShieldAlert className="w-3 h-3" />
            Zero-Knowledge: We never store your password.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
