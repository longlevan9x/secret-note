"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/context/WorkspaceContext";

export default function Home() {
  const { masterPassword } = useWorkspace();
  const router = useRouter();

  useEffect(() => {
    if (masterPassword) {
      router.push("/projects");
    }
  }, [masterPassword, router]);

  return (
    <DashboardShell title="Welcome">
      <div className="flex h-full items-center justify-center text-muted-foreground italic">
        Redirecting to projects...
      </div>
    </DashboardShell>
  );
}
