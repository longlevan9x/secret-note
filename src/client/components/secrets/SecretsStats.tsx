"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/client/components/ui";

interface SecretsStatsProps {
  totalKeys: number;
  totalLinks: number;
  affectedProjects: number;
}

export function SecretsStats({ totalKeys, totalLinks, affectedProjects }: SecretsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-zinc-900/40 border-zinc-800">
        <CardHeader className="p-4">
          <CardDescription className="text-[10px] uppercase font-black tracking-widest opacity-50">
            Total Unique Keys
          </CardDescription>
          <CardTitle className="text-2xl font-black">{totalKeys}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-zinc-900/40 border-zinc-800">
        <CardHeader className="p-4">
          <CardDescription className="text-[10px] uppercase font-black tracking-widest opacity-50">
            Active Links
          </CardDescription>
          <CardTitle className="text-2xl font-black">{totalLinks}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-zinc-900/40 border-zinc-800">
        <CardHeader className="p-4">
          <CardDescription className="text-[10px] uppercase font-black tracking-widest opacity-50">
            Affected Projects
          </CardDescription>
          <CardTitle className="text-2xl font-black">{affectedProjects}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
