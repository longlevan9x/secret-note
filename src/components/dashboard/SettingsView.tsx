"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/context/WorkspaceContext";
import { StorageConfig, StorageType } from "@/core/schema/types";
import { 
  Cloud, 
  Database, 
  Laptop, 
  Save, 
  RefreshCcw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SettingsView() {
  const { storageConfig, updateStorageConfig, syncData } = useWorkspace();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<StorageType>(storageConfig.type);
  
  // GitHub state
  const [ghToken, setGhToken] = useState(storageConfig.github?.token || "");
  const [ghRepo, setGhRepo] = useState(storageConfig.github?.repo || "");
  const [ghPath, setGhPath] = useState(storageConfig.github?.path || "workspace.json");
  const [ghBranch, setGhBranch] = useState(storageConfig.github?.branch || "main");

  // Supabase state
  const [sbUrl, setSbUrl] = useState(storageConfig.supabase?.url || "");
  const [sbKey, setSbKey] = useState(storageConfig.supabase?.key || "");
  const [sbWorkspaceId, setSbWorkspaceId] = useState(storageConfig.supabase?.workspaceId || "default");

  const handleSave = () => {
    const newConfig: StorageConfig = {
      type: activeTab,
      github: activeTab === "github" ? {
        token: ghToken,
        repo: ghRepo,
        path: ghPath,
        branch: ghBranch,
      } : storageConfig.github,
      supabase: activeTab === "supabase" ? {
        url: sbUrl,
        key: sbKey,
        workspaceId: sbWorkspaceId,
      } : storageConfig.supabase,
    };

    updateStorageConfig(newConfig);
    toast({
      title: "Settings Saved",
      description: `Storage provider switched to ${activeTab.toUpperCase()}`,
      variant: "success",
    });
  };

  const handleSync = async () => {
    try {
      await syncData();
      toast({
        title: "Sync Successful",
        description: "Your data has been synchronized with the remote provider.",
        variant: "success",
      });
    } catch (e: unknown) {
      toast({
        title: "Sync Failed",
        description: (e as Error)?.message || "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your workspace storage and cloud synchronization.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSync} className="gap-2">
          <RefreshCcw className="w-4 h-4" />
          Sync Now
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as StorageType)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted/50 rounded-xl">
          <TabsTrigger value="local" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
            <Laptop className="w-4 h-4" />
            Local Storage
          </TabsTrigger>
          <TabsTrigger value="github" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
            <Cloud className="w-4 h-4" />
            GitHub Repo
          </TabsTrigger>
          <TabsTrigger value="supabase" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
            <Database className="w-4 h-4" />
            Supabase DB
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="local">
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
          </TabsContent>

          <TabsContent value="github">
            <Card className="border-2 border-primary/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-black">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle>GitHub Repository Sync</CardTitle>
                    <CardDescription>Sync your encrypted workspace data with a private GitHub repository.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="gh-token">Personal Access Token (fine-grained)</Label>
                    <Input 
                      id="gh-token" 
                      type="password" 
                      placeholder="github_pat_..." 
                      value={ghToken} 
                      onChange={e => setGhToken(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gh-repo">Repository Path (owner/repo)</Label>
                    <Input 
                      id="gh-repo" 
                      placeholder="username/my-secret-vault" 
                      value={ghRepo} 
                      onChange={e => setGhRepo(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gh-path">File Path in Repo</Label>
                    <Input 
                      id="gh-path" 
                      placeholder="data/workspace.json" 
                      value={ghPath} 
                      onChange={e => setGhPath(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gh-branch">Branch</Label>
                    <Input 
                      id="gh-branch" 
                      placeholder="main" 
                      value={ghBranch} 
                      onChange={e => setGhBranch(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supabase">
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
          </TabsContent>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} size="lg" className="h-12 px-10 gap-2 font-bold shadow-xl shadow-primary/20">
            <Save className="w-5 h-5" />
            Apply Storage Settings
          </Button>
        </div>
      </Tabs>
    </div>
  );
}
