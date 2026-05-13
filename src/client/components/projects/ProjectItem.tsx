"use client";

import React, { useState } from "react";
import { X, Plus, ExternalLink } from "lucide-react";
import { Button, buttonVariants } from "@/client/components/ui/Button";
import { Project, ServiceNode } from "@/shared/schema/types";
import { AddServiceDialog } from "../services/AddServiceDialog";
import { ServiceCard } from "../services/ServiceCard";
import { ConfirmDialog } from "@/client/components/ui/ConfirmDialog";
import { useRouter } from "next/navigation";
import { cn } from "@/client/utils/utils";

interface ProjectItemProps {
  project: Project;
  selectedServiceId?: string;
  onSelectService: (service: ServiceNode) => void;
  onRemoveService: (projectId: string, serviceId: string) => void;
  onRemoveProject: (projectId: string) => void;
  onAddService: (projectId: string, serviceData: Omit<ServiceNode, "id">) => void;
}

export function ProjectItem({
  project,
  selectedServiceId,
  onSelectService,
  onRemoveService,
  onRemoveProject,
  onAddService
}: ProjectItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between group">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-bold text-base tracking-tight">{project.name}</h3>
            {project.description && <p className="text-[10px] text-muted-foreground line-clamp-1">{project.description}</p>}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push(`/projects/${project.id}`)}
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full transition-all"
              title="Manage Project"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <AddServiceDialog 
              onAdd={(serviceData) => onAddService(project.id, serviceData)} 
              trigger={
                <button className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full transition-all")}>
                  <Plus className="w-4 h-4" />
                </button>
              }
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowConfirm(true)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col gap-2.5">
          {project.nodes.map((service) => (
            <ServiceCard 
              key={service.id}
              service={service}
              isSelected={selectedServiceId === service.id}
              onClick={() => onSelectService(service)}
              onDelete={() => onRemoveService(project.id, service.id)}
            />
          ))}
          {project.nodes.length === 0 && (
            <div className="py-6 px-4 rounded-xl border-2 border-dashed border-muted-foreground/10 flex flex-col items-center justify-center gap-2">
               <p className="text-[10px] text-muted-foreground italic text-center leading-relaxed">No services yet.<br/>Click the plus icon to add one.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={() => onRemoveProject(project.id)}
        title="Delete Project"
        description="Are you sure you want to delete this project and all its services?"
      />
    </>
  );
}
