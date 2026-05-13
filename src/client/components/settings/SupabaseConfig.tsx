"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/client/components/ui/Card";
import { Label } from "@/client/components/ui/Label";
import { Input } from "@/client/components/ui/Input";
import { Database } from "lucide-react";

interface SupabaseConfigProps {
  sbUrl: string;
  setSbUrl: (val: string) => void;
  sbKey: string;
  setSbKey: (val: string) => void;
  sbWorkspaceId: string;
  setSbWorkspaceId: (val: string) => void;
}

export function SupabaseConfig({
  sbUrl,
  setSbUrl,
  sbKey,
  setSbKey,
  sbWorkspaceId,
  setSbWorkspaceId,
}: SupabaseConfigProps) {
  return (
    <Card className="border-2 border-primary/10 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500 text-white">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>Supabase Database Sync</CardTitle>
            <CardDescription>Store your data in a hosted PostgreSQL database on Supabase.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sb-url">Supabase Project URL</Label>
            <Input 
              id="sb-url" 
              placeholder="https://your-project.supabase.co" 
              value={sbUrl} 
              onChange={e => setSbUrl(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sb-key">Supabase API Key (service_role or anon with RLS)</Label>
            <Input 
              id="sb-key" 
              type="password" 
              placeholder="eyJh..." 
              value={sbKey} 
              onChange={e => setSbKey(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sb-ws">Workspace ID (Unique identifier)</Label>
            <Input 
              id="sb-ws" 
              placeholder="my-personal-workspace" 
              value={sbWorkspaceId} 
              onChange={e => setSbWorkspaceId(e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
