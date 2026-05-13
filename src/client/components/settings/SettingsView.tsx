"use client";

import { useState } from "react";
import { 
  Label, 
  Input, 
  Button, 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/client/components/ui";
import { useWorkspace } from "@/client/context/WorkspaceContext";
import { StorageType } from "@/shared/schema/types";
import { 
  Laptop, 
  Save, 
  RefreshCcw,
  Cloud,
  Database
} from "lucide-react";
import { useToast } from "@/client/hooks/use-toast";
import { exportToBitwardenCSV, downloadFile } from "@/client/utils/export-utils";
import { APP_CONFIG } from "@/shared/constants/app";

// Sub-components
import { LocalConfig } from "./LocalConfig";
import { GitHubConfig } from "./GitHubConfig";
import { SupabaseConfig } from "./SupabaseConfig";
import { DataPortability } from "./DataPortability";
import { SecuritySummary } from "./SecuritySummary";

export function SettingsView() {
  const { data, storageConfig, updateStorageConfig, syncData } = useWorkspace();
  const { toast } = useToast();

  // Form state
  const [activeTab, setActiveTab] = useState<StorageType>(storageConfig.type);
  const [vaultName, setVaultName] = useState(storageConfig.name);
  const [ghToken, setGhToken] = useState(storageConfig.github?.token || "");
  const [ghRepo, setGhRepo] = useState(storageConfig.github?.repo || "");
  const [ghPath, setGhPath] = useState(storageConfig.github?.path || APP_CONFIG.DEFAULTS.GITHUB_PATH);
  const [ghBranch, setGhBranch] = useState(storageConfig.github?.branch || APP_CONFIG.DEFAULTS.GITHUB_BRANCH);
  const [sbUrl, setSbUrl] = useState(storageConfig.supabase?.url || "");
  const [sbKey, setSbKey] = useState(storageConfig.supabase?.key || "");
  const [sbWorkspaceId, setSbWorkspaceId] = useState(storageConfig.supabase?.workspaceId || APP_CONFIG.DEFAULTS.SUPABASE_WORKSPACE_ID);

  const handleSave = () => {
    updateStorageConfig({
      ...storageConfig,
      name: vaultName,
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
    });

    toast({
      title: "Settings Saved",
      description: "Storage configuration updated successfully.",
      variant: "success",
    });
  };

  const handleExport = () => {
    if (!data) {
      toast({
        title: "Export Failed",
        description: "No data available to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      const csv = exportToBitwardenCSV(data);
      const date = new Date().toISOString().split("T")[0];
      downloadFile(csv, `secret-note-export-${date}.csv`, "text/csv");
      
      toast({
        title: "Export Successful",
        description: "Your data has been exported in Bitwarden CSV format.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Export Error",
        description: "Failed to decrypt and export data.",
        variant: "destructive",
      });
    }
  };

  const handleSync = async () => {
    try {
      await syncData();
      toast({
        title: "Sync Successful",
        description: "Your data has been synchronized.",
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

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="vault-name-settings" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Vault Name</Label>
          <Input 
            id="vault-name-settings" 
            value={vaultName} 
            onChange={e => setVaultName(e.target.value)}
            className="h-12 bg-zinc-900 border-zinc-800 text-xl font-black"
          />
        </div>
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
            <LocalConfig />
          </TabsContent>

          <TabsContent value="github">
            <GitHubConfig 
              ghToken={ghToken} setGhToken={setGhToken}
              ghRepo={ghRepo} setGhRepo={setGhRepo}
              ghPath={ghPath} setGhPath={setGhPath}
              ghBranch={ghBranch} setGhBranch={setGhBranch}
            />
          </TabsContent>

          <TabsContent value="supabase">
            <SupabaseConfig 
              sbUrl={sbUrl} setSbUrl={setSbUrl}
              sbKey={sbKey} setSbKey={setSbKey}
              sbWorkspaceId={sbWorkspaceId} setSbWorkspaceId={setSbWorkspaceId}
            />
          </TabsContent>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} size="lg" className="h-12 px-10 gap-2 font-bold shadow-xl shadow-primary/20">
            <Save className="w-5 h-5" />
            Apply Changes
          </Button>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-900">
        <DataPortability handleExport={handleExport} />
        <SecuritySummary />
      </div>
    </div>
  );
}
