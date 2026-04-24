"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { DependencyGraph } from "@/components/graph/DependencyGraph";

export default function GraphPage() {
  return (
    <DashboardShell title="Dependency Graph">
      <div className="h-full border rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50 overflow-hidden shadow-inner relative">
        <DependencyGraph />
      </div>
    </DashboardShell>
  );
}
