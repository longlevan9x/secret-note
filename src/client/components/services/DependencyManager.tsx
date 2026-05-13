"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui";
import { Check } from "lucide-react";
import { WorkspaceData, Project, ServiceNode } from "@/shared/schema/types";

interface DependencyManagerProps {
  data: WorkspaceData | null;
  serviceId: string;
  projectId: string;
  dependsOn: string[];
  toggleDependency: (projectId: string, serviceId: string, targetId: string) => void;
}

export function DependencyManager({
  data,
  serviceId,
  projectId,
  dependsOn,
  toggleDependency,
}: DependencyManagerProps) {
  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader>
        <CardTitle>Service Dependencies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-4">
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-white">Manage Relationships</p>
            <p className="text-xs text-muted-foreground">Select other services that this service depends on to visualize relationships on the graph.</p>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {data?.projects.map((project: Project) => {
              const otherNodes = project.nodes.filter((n: ServiceNode) => n.id !== serviceId);
              if (otherNodes.length === 0) return null;

              return (
                <div key={project.id} className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">
                    Project: {project.name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {otherNodes.map((node: ServiceNode) => {
                      const isSelected = dependsOn.includes(node.id);
                      return (
                        <button
                          key={node.id}
                          onClick={() => toggleDependency(projectId, serviceId, node.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                            isSelected 
                              ? "bg-primary/10 border-primary text-white shadow-lg shadow-primary/10" 
                              : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? "bg-primary border-primary" : "border-zinc-700"
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[4]" />}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold truncate">{node.name}</span>
                            <span className="text-[10px] opacity-60 uppercase">{node.provider} - {node.env}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {data?.projects.every(p => p.nodes.length === (p.id === projectId ? 1 : 0)) && (
              <p className="text-xs text-zinc-500 italic py-8 text-center">No other services available in the workspace to link.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
