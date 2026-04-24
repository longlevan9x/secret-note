"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project, ServiceNode } from "@/core/schema/types";
import { UI_TEXT } from "@/core/constants/app";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { AddServiceDialog } from "./AddServiceDialog";
import { ServiceCard } from "./ServiceCard";

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
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between group">
        <h3 className="font-semibold text-lg">{project.name}</h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <DeleteConfirmDialog 
            title="Delete Project"
            description={UI_TEXT.DELETE_PROJECT_CONFIRM}
            onConfirm={() => onRemoveProject(project.id)}
            trigger={
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
              >
                <X className="w-4 h-4" />
              </Button>
            }
          />
          <AddServiceDialog onAdd={(serviceData) => onAddService(project.id, serviceData)} />
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
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
          <p className="text-xs text-muted-foreground pl-2 italic">No services.</p>
        )}
      </div>
    </div>
  );
}
