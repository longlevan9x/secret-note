"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProjectList } from "@/components/dashboard/ProjectList";

export default function ProjectsPage() {
  return (
    <DashboardShell title="Projects">
      <ProjectList />
    </DashboardShell>
  );
}
