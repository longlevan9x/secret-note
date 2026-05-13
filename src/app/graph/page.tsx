"use client";

import { DashboardShell } from "@/client/components/layout/DashboardShell";
import { DependencyGraph } from "@/client/components/graph/DependencyGraph";
import { ReactFlowProvider } from "@xyflow/react";

export default function GraphPage() {
  return (
    <DashboardShell title="Dependency Graph">
      <div className="h-full border rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50 overflow-hidden shadow-inner relative">
        <ReactFlowProvider>
          <DependencyGraph />
        </ReactFlowProvider>
      </div>
    </DashboardShell>
  );
}
