"use client";

import { useWorkspace } from "@/client/context/WorkspaceContext";
import { useToast } from "@/client/hooks/use-toast";
import { useState } from "react";
import { ServiceDetail } from "../services/ServiceDetail";
import { ProjectItem } from "./ProjectItem";
import { AddProjectDialog } from "./AddProjectDialog";
import { ConfirmDialog } from "@/client/components/ui/ConfirmDialog";
import { Label, Card } from "@/client/components/ui";
import { LayoutGrid } from "lucide-react";

export function ProjectList() {
  const { data, addProject, removeProject, addService, removeService } = useWorkspace();
  const { toast } = useToast();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "project" | "service";
    projectId: string;
    serviceId?: string;
    title: string;
  } | null>(null);

  const selectedService = data?.projects
    .flatMap(p => p.nodes)
    .find(s => s.id === selectedServiceId) || null;

  if (!data) return null;

  const handleAddProject = async (projectData: { name: string; description?: string; icon?: string }) => {
    const createdProject = await addProject(projectData);
    if (!createdProject) return;
    toast({
      title: "Project Created",
      description: `"${createdProject.name}" has been added.`,
      variant: "success",
    });
  };

  const executeRemoveProject = async (projectId: string) => {
    const project = data.projects.find(p => p.id === projectId);
    await removeProject(projectId);
    if (selectedServiceId && project?.nodes.some(n => n.id === selectedServiceId)) {
      setSelectedServiceId(null);
    }
    toast({ title: "Project Deleted" });
  };

  const executeRemoveService = async (projectId: string, serviceId: string) => {
    await removeService(projectId, serviceId);
    if (selectedServiceId === serviceId) setSelectedServiceId(null);
    toast({ title: "Service Deleted" });
  };

  const handleRemoveProject = (projectId: string) => {
    const project = data.projects.find(p => p.id === projectId);
    setConfirmDelete({ type: "project", projectId, title: project?.name || "this project" });
  };

  const handleRemoveService = (projectId: string, serviceId: string) => {
    setConfirmDelete({ type: "service", projectId, serviceId, title: "this service" });
  };

  const handleAddService = async (projectId: string, newServiceData: Parameters<typeof addService>[1]) => {
    await addService(projectId, newServiceData);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-500">
        {/* Projects Column */}
        <div className="w-full md:w-80 shrink-0">
          <div className="sticky top-0 space-y-6">
            <div className="flex flex-col gap-1.5 px-1">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Workspace Projects</Label>
              <p className="text-[10px] text-muted-foreground font-medium">Select a service to manage secrets</p>
            </div>
            
            <AddProjectDialog onAdd={handleAddProject} />
            
            <div className="flex flex-col gap-8 mt-6">
              {data.projects.length === 0 && (
                <Card className="p-12 border-dashed bg-zinc-900/10 flex flex-col items-center justify-center gap-3">
                  <LayoutGrid className="w-8 h-8 opacity-10" />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">No Projects</p>
                </Card>
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
          </div>
        </div>

        {/* Service Detail Column */}
        <div className="flex-1 min-w-0">
          {selectedService ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 shadow-2xl overflow-hidden">
              <ServiceDetail 
                key={selectedService.id}
                service={selectedService} 
                projectId={data.projects.find(p => p.nodes.some(n => n.id === selectedService.id))?.id || ""} 
                onDelete={() => setSelectedServiceId(null)}
              />
            </div>
          ) : (
            <div className="h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl text-muted-foreground gap-4 bg-zinc-900/10">
               <div className="w-16 h-16 rounded-full bg-zinc-900/50 flex items-center justify-center border border-zinc-800">
                  <LayoutGrid className="w-8 h-8 opacity-20" />
               </div>
               <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Choose a service to begin</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete?.type === "project") executeRemoveProject(confirmDelete.projectId);
          else if (confirmDelete?.type === "service") executeRemoveService(confirmDelete.projectId, confirmDelete.serviceId!);
        }}
        title={`Delete ${confirmDelete?.type === "project" ? "Project" : "Service"}`}
        description={`Are you sure you want to delete ${confirmDelete?.title}?`}
      />
    </>
  );
}
