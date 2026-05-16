import { DashboardShell } from "@/client/components/layout/DashboardShell";
import { DependencyGraphCanvas } from "@/client/components/graph/DependencyGraphCanvas";

export default function GraphPage() {
  return (
    <DashboardShell title="Dependency Graph">
      <div className="h-full border rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50 overflow-hidden shadow-inner relative">
        <DependencyGraphCanvas />
      </div>
    </DashboardShell>
  );
}
