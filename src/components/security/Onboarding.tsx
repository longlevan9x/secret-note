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
import { ShieldCheck, Copy, CheckCircle2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateRecoveryKey } from "@/core/security/crypto";

export function Onboarding() {
  const { setupMasterPassword } = useWorkspace();
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoveryKey] = useState(() => generateRecoveryKey());
  const { toast } = useToast();

  const handleNext = () => {
    if (step === 1) {
      if (password.length < 8) {
        toast({
          title: "Password too short",
          description: "Please use at least 8 characters.",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (password !== confirmPassword) {
        toast({
          title: "Passwords do not match",
          description: "Please check again.",
          variant: "destructive",
        });
        return;
      }
      setStep(3);
    }
  };

  const handleComplete = async () => {
    await setupMasterPassword(password);
    toast({
      title: "Workspace Ready",
      description: "Your master password has been set.",
      variant: "success",
    });
  };

  const copyRecoveryKey = () => {
    navigator.clipboard.writeText(recoveryKey);
    toast({
      title: "Copied",
      description: "Recovery key copied to clipboard.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-xl animate-in zoom-in-95 duration-300">
      <Card className="w-full max-w-lg border-2 border-primary/20 shadow-2xl bg-zinc-900 overflow-hidden">
        <div className="h-1.5 w-full bg-zinc-800">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black">Welcome to Secret Note</CardTitle>
          <CardDescription>Let&apos;s secure your serverless ecosystem.</CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label className="text-lg font-bold">Set Master Password</Label>
                <p className="text-sm text-muted-foreground">This password will be used to encrypt all your data. Do not lose it.</p>
                <Input 
                  type="password" 
                  placeholder="Create a strong password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-lg"
                  autoFocus
                />
              </div>
              <Button onClick={handleNext} className="w-full h-12 text-lg font-bold">Continue</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label className="text-lg font-bold">Confirm Password</Label>
                <Input 
                  type="password" 
                  placeholder="Repeat your password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 text-lg"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="h-12 px-6">Back</Button>
                <Button onClick={handleNext} className="w-full h-12 text-lg font-bold">Verify & Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  Save your Recovery Key!
                </div>
                <p className="text-xs">If you forget your master password, this is the ONLY way to recover your data. We cannot reset your password.</p>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-primary/5 blur-xl rounded-xl group-hover:bg-primary/10 transition-colors" />
                <div className="relative p-6 bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-xl text-center font-mono text-xl tracking-wider select-all">
                  {recoveryKey}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={copyRecoveryKey} className="h-12 gap-2">
                  <Copy className="w-4 h-4" />
                  Copy Key
                </Button>
                <Button onClick={handleComplete} className="w-full h-12 text-lg font-bold gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Finish Setup
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={className}>{children}</div>;
}
