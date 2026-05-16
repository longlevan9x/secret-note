"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { DependencyGraph } from "./DependencyGraph";

export function DependencyGraphCanvas() {
  return (
    <ReactFlowProvider>
      <DependencyGraph />
    </ReactFlowProvider>
  );
}
