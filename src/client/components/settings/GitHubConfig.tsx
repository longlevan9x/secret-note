"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/client/components/ui/Card";
import { Label } from "@/client/components/ui/Label";
import { Input } from "@/client/components/ui/Input";
import { Cloud } from "lucide-react";

interface GitHubConfigProps {
  ghToken: string;
  setGhToken: (val: string) => void;
  ghRepo: string;
  setGhRepo: (val: string) => void;
  ghPath: string;
  setGhPath: (val: string) => void;
  ghBranch: string;
  setGhBranch: (val: string) => void;
}

export function GitHubConfig({
  ghToken,
  setGhToken,
  ghRepo,
  setGhRepo,
  ghPath,
  setGhPath,
  ghBranch,
  setGhBranch,
}: GitHubConfigProps) {
  return (
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
  );
}
