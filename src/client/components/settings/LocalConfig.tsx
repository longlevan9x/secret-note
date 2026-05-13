"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/client/components/ui/Card";
import { Laptop, AlertCircle, CheckCircle2 } from "lucide-react";

export function LocalConfig() {
  return (
    <Card className="border-2 border-primary/10 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Laptop className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>Browser Local Storage</CardTitle>
            <CardDescription>Your data is stored only in this browser&apos;s local storage.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>Warning: Clearing browser data or changing browsers will result in data loss if not backed up or synced to a cloud provider.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          No configuration required.
        </div>
      </CardContent>
    </Card>
  );
}
