"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/client/components/ui/Card";
import { Button } from "@/client/components/ui/Button";
import { Download, ExternalLink } from "lucide-react";

interface DataPortabilityProps {
  handleExport: () => void;
}

export function DataPortability({ handleExport }: DataPortabilityProps) {
  return (
    <Card className="border-2 border-primary/10 bg-zinc-900/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>Data Portability</CardTitle>
            <CardDescription>Export your data for backup or migration.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Download your decrypted secrets in a Bitwarden-compatible CSV format. 
          This file will contain sensitive information in plain text.
        </p>
        <Button variant="outline" className="w-full gap-2 border-zinc-800 hover:bg-zinc-900" onClick={handleExport}>
          <ExternalLink className="w-4 h-4" />
          Export to Bitwarden CSV
        </Button>
      </CardContent>
    </Card>
  );
}
