"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/client/components/ui/Card";
import { ShieldCheck } from "lucide-react";

export function SecuritySummary() {
  return (
    <Card className="border-2 border-destructive/10 bg-zinc-900/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>Security & Resilience</CardTitle>
            <CardDescription>Advanced protection for your vault.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-900">
          <div className="space-y-0.5">
            <p className="text-sm font-bold">Self-Destruct Mode</p>
            <p className="text-[10px] text-muted-foreground uppercase">Enabled (5 attempts)</p>
          </div>
          <div className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">ACTIVE</div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-900">
          <div className="space-y-0.5">
            <p className="text-sm font-bold">Privacy Shield</p>
            <p className="text-[10px] text-muted-foreground uppercase">Auto-blur on inactive tab</p>
          </div>
          <div className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">ACTIVE</div>
        </div>
      </CardContent>
    </Card>
  );
}
