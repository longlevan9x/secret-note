"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkspace } from "@/client/context/WorkspaceContext";
import { DashboardShell } from "@/client/components/layout/DashboardShell";
import { ProjectDetail } from "@/client/components/projects/ProjectDetail";
import { Button } from "@/client/components/ui/Button";
import { ChevronLeft } from "lucide-react";

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data } = useWorkspace();
  
  const project = data?.projects.find(p => p.id === id);

  if (!project) {
    return (
      <DashboardShell title="Project Not Found">
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <p className="text-muted-foreground">The project you are looking for does not exist.</p>
          <Button onClick={() => router.push("/projects")}>Back to Projects</Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={project.name}>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 -ml-2 text-muted-foreground hover:text-primary"
          onClick={() => router.push("/projects")}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Projects
        </Button>
      </div>
      
      <ProjectDetail project={project} />
    </DashboardShell>
  );
}
