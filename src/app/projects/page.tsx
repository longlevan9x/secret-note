import { DashboardShell } from "@/client/components/layout/DashboardShell";
import { ProjectList } from "@/client/components/projects/ProjectList";

export default function ProjectsPage() {
  return (
    <DashboardShell title="Projects">
      <ProjectList />
    </DashboardShell>
  );
}
