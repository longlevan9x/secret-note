"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SettingsView() {
  const [githubToken, setGithubToken] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  
  const handleSave = () => {
    // In a real implementation, these would be saved to WorkspaceData settings or local storage
    alert("Settings saved! (Stub)");
  };

  return (
    <div className="flex flex-col h-full p-6 items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Storage Settings</CardTitle>
          <CardDescription>Configure where your encrypted workspace data is stored.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Storage</Label>
            <div className="font-medium text-primary">Local Storage (Browser)</div>
          </div>
          
          <div className="border-t pt-4 space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground">GitHub Sync (Coming Soon)</h3>
            
            <div className="space-y-2">
              <Label htmlFor="gh-token">Personal Access Token</Label>
              <Input 
                id="gh-token" 
                type="password" 
                placeholder="ghp_xxxxxxxxxxxx" 
                value={githubToken} 
                onChange={e => setGithubToken(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gh-repo">Repository (owner/repo)</Label>
              <Input 
                id="gh-repo" 
                placeholder="username/secret-note-data" 
                value={githubRepo} 
                onChange={e => setGithubRepo(e.target.value)} 
              />
            </div>
            
            <Button onClick={handleSave} className="w-full">Save Configuration</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
