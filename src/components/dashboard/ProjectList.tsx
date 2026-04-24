"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Button,
  Input,
  ScrollArea
} from "@/components/ui";
import { useState } from "react";
import { ServiceDetail } from "./ServiceDetail";
import { UI_TEXT } from "@/core/constants/app";
import { ProjectItem } from "./ProjectItem";
import { Plus } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function ProjectList() {
  const { data, addProject, removeProject, addService, removeService } = useWorkspace();
  const { toast } = useToast();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  
  // Dialog State
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "project" | "service";
    projectId: string;
    serviceId?: string;
    title: string;
  } | null>(null);

  // Deriving the selected service from data to keep it reactive
  const selectedService = data?.projects
    .flatMap(p => p.nodes)
    .find(s => s.id === selectedServiceId) || null;

  if (!data) return null;

  const handleAddProject = async () => {
    if (!newProjectName.trim()) return;

    const createdProject = await addProject(newProjectName);
    setNewProjectName("");

    if (!createdProject) return;

    toast({
      title: "Project Created",
      description: `"${createdProject.name}" has been added to your workspace.`,
      variant: "success",
    });
  };

  const executeRemoveProject = async (projectId: string) => {
    const project = data.projects.find(p => p.id === projectId);
    await removeProject(projectId);
    
    if (selectedServiceId && project?.nodes.some(n => n.id === selectedServiceId)) {
      setSelectedServiceId(null);
    }

    toast({
      title: "Project Deleted",
      description: `"${project?.name}" has been removed.`,
    });
  };

  const executeRemoveService = async (projectId: string, serviceId: string) => {
    await removeService(projectId, serviceId);
    
    if (selectedServiceId === serviceId) {
      setSelectedServiceId(null);
    }

    toast({
      title: "Service Deleted",
      description: "The service has been removed from your project.",
    });
  };

  const handleRemoveProject = (projectId: string) => {
    const project = data.projects.find(p => p.id === projectId);
    setConfirmDelete({
      type: "project",
      projectId,
      title: project?.name || "this project"
    });
  };

  const handleRemoveService = (projectId: string, serviceId: string) => {
    setConfirmDelete({
      type: "service",
      projectId,
      serviceId,
      title: "this service"
    });
  };

  const handleAddService = async (projectId: string, newServiceData: Parameters<typeof addService>[1]) => {
    await addService(projectId, newServiceData);
  };

  return (
    <>
      <div className="flex h-full gap-6 overflow-hidden">
        {/* Projects Column */}
        <div className="w-1/4 flex flex-col gap-4 min-h-0 border-r pr-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Projects</h2>
              <p className="text-[10px] text-muted-foreground">Manage your service groups</p>
            </div>
            
            <div className="flex gap-2 p-1.5 rounded-xl bg-muted/30 border border-border/50 focus-within:border-primary/30 transition-colors">
              <Input 
                placeholder="New Project..." 
                value={newProjectName} 
                onChange={(e) => setNewProjectName(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
                className="h-9 border-0 bg-transparent focus-visible:ring-0 shadow-none text-sm"
              />
              <Button size="sm" onClick={handleAddProject} className="h-9 w-9 p-0 rounded-lg shadow-sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1 -mx-2 px-2 min-h-0">
            <div className="flex flex-col gap-8 py-4">
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
                key={selectedService.id}
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

      <ConfirmDialog 
        isOpen={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete?.type === "project") {
            executeRemoveProject(confirmDelete.projectId);
          } else if (confirmDelete?.type === "service") {
            executeRemoveService(confirmDelete.projectId, confirmDelete.serviceId!);
          }
        }}
        title={`Delete ${confirmDelete?.type === "project" ? "Project" : "Service"}`}
        description={`Are you sure you want to delete ${confirmDelete?.title}? This action cannot be undone.`}
      />
    </>
  );
}
