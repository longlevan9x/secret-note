"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project, ServiceNode } from "@/core/schema/types";
import { UI_TEXT } from "@/core/constants/app";
import { AddServiceDialog } from "./AddServiceDialog";
import { ServiceCard } from "./ServiceCard";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

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

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between group">
          <h3 className="font-bold text-base tracking-tight">{project.name}</h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
            <AddServiceDialog 
              onAdd={(serviceData) => onAddService(project.id, serviceData)} 
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full transition-all">
                  <Plus className="w-4 h-4" />
                </Button>
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
        description={UI_TEXT.DELETE_PROJECT_CONFIRM}
      />
    </>
  );
}
