"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import { useToast } from "@/hooks/use-toast";
import { Project, ServiceNode } from "@/core/schema/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  ScrollArea
} from "@/components/ui";
import { useState, useEffect } from "react";
import { ServiceDetail } from "./ServiceDetail";
import { UI_TEXT } from "@/core/constants/app";
import { ProjectItem } from "./ProjectItem";

export function ProjectList() {
  const { data, updateWorkspaceData } = useWorkspace();
  const { toast } = useToast();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");

  // Find the actual service object from the latest workspace data
  const selectedService = data?.projects
    .flatMap(p => p.nodes)
    .find(s => s.id === selectedServiceId) || null;

  useEffect(() => {
    const handleSelectService = (e: any) => {
      setSelectedServiceId(e.detail);
    };

    window.addEventListener("select-service", handleSelectService);
    return () => window.removeEventListener("select-service", handleSelectService);
  }, []);

  if (!data) return null;

  const handleAddProject = async () => {
    if (!newProjectName.trim()) return;
    
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: newProjectName,
      nodes: [],
    };

    await updateWorkspaceData({
      ...data,
      projects: [...data.projects, newProject],
    });
    setNewProjectName("");
    toast({
      title: "Project Created",
      description: `"${newProjectName}" has been added to your workspace.`,
      variant: "success",
    });
  };

  const handleRemoveProject = async (projectId: string) => {
    if (!data) return;
    const project = data.projects.find(p => p.id === projectId);
    
    await updateWorkspaceData({
      ...data,
      projects: data.projects.filter(p => p.id !== projectId),
    });
    
    if (selectedServiceId && project?.nodes.some(n => n.id === selectedServiceId)) {
      setSelectedServiceId(null);
    }

    toast({
      title: "Project Deleted",
      description: `"${project?.name}" has been removed.`,
    });
  };

  const handleRemoveService = async (projectId: string, serviceId: string) => {
    if (!data) return;
    
    const updatedProjects = data.projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          nodes: p.nodes.filter(n => n.id !== serviceId),
        };
      }
      return p;
    });

    await updateWorkspaceData({ ...data, projects: updatedProjects });
    
    if (selectedServiceId === serviceId) {
      setSelectedServiceId(null);
    }

    toast({
      title: "Service Deleted",
      description: "The service has been removed from your project.",
    });
  };

  const handleAddService = (projectId: string, newServiceData: Omit<ServiceNode, "id">) => {
    const newService: ServiceNode = {
      id: `svc-${Date.now()}`,
      ...newServiceData,
    };

    const updatedProjects = data.projects.map((p) => {
      if (p.id === projectId) {
        return { ...p, nodes: [...p.nodes, newService] };
      }
      return p;
    });

    updateWorkspaceData({ ...data, projects: updatedProjects });
  };

  return (
    <div className="flex h-full gap-6 overflow-hidden">
      {/* Projects Column */}
      <div className="w-1/4 flex flex-col gap-4 min-h-0">
        <div className="flex gap-2 flex-shrink-0">
          <Input 
            placeholder="New Project Name" 
            value={newProjectName} 
            onChange={(e) => setNewProjectName(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
          />
          <Button onClick={handleAddProject}>Add</Button>
        </div>
        
        <ScrollArea className="flex-1 rounded-md border bg-zinc-50/50 dark:bg-zinc-950/50 min-h-0">
          <div className="p-4 flex flex-col gap-6">
            {data.projects.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">{UI_TEXT.NO_PROJECTS}</p>
            )}
            {data.projects.map((project) => (
              <ProjectItem 
                key={project.id}
                project={project}
                selectedServiceId={selectedServiceId || undefined}
                onSelectService={(s) => setSelectedServiceId(s.id)}
                onRemoveService={handleRemoveService}
                onRemoveProject={handleRemoveProject}
                onAddService={handleAddService}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Service Detail Column */}
      <div className="w-3/4 flex flex-col min-h-0 border rounded-md bg-card overflow-hidden">
        {selectedService ? (
          <ScrollArea className="flex-1 min-h-0">
            <ServiceDetail 
              service={selectedService} 
              projectId={data.projects.find(p => p.nodes.some(n => n.id === selectedService.id))?.id || ""} 
              onDelete={() => setSelectedServiceId(null)}
            />
          </ScrollArea>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground bg-zinc-50/30 dark:bg-zinc-950/30">
            {UI_TEXT.SELECT_SERVICE_PROMPT}
          </div>
        )}
      </div>
    </div>
  );
}
