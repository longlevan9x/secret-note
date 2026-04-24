"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { SettingsView } from "@/components/dashboard/SettingsView";

export default function SettingsPage() {
  return (
    <DashboardShell title="Settings">
      <div className="h-full border rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50 overflow-hidden shadow-inner p-6">
        <SettingsView />
      </div>
    </DashboardShell>
  );
}
