"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Button, Select, SelectItem } from "@/client/components/ui";

interface SecretsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterProject: string;
  setFilterProject: (value: string) => void;
  filterProvider: string;
  setFilterProvider: (value: string) => void;
  projectsList: Array<{ id: string; name: string }>;
  providersList: string[];
  onClear: () => void;
}

export function SecretsFilter({
  searchTerm,
  setSearchTerm,
  filterProject,
  setFilterProject,
  filterProvider,
  setFilterProvider,
  projectsList,
  providersList,
  onClear
}: SecretsFilterProps) {
  const hasFilters = searchTerm || filterProject !== "all" || filterProvider !== "all";

  return (
    <div className="flex flex-col md:flex-row gap-4 items-end bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50 shadow-sm backdrop-blur-sm">
      <div className="relative flex-1 group">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 ml-1 block">
          Search Secrets
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Key name, note, or project..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-zinc-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full md:w-[200px]">
        <Select 
          label="Project" 
          value={filterProject} 
          onChange={(e) => setFilterProject(e.target.value)}
        >
          <SelectItem value="all">All Projects</SelectItem>
          {projectsList.map(p => (
            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
          ))}
        </Select>
      </div>

      <div className="w-full md:w-[180px]">
        <Select 
          label="Provider" 
          value={filterProvider} 
          onChange={(e) => setFilterProvider(e.target.value)}
        >
          <SelectItem value="all">All Providers</SelectItem>
          {providersList.map(provider => (
            <SelectItem key={provider} value={provider.toLowerCase()}>{provider}</SelectItem>
          ))}
        </Select>
      </div>

      {hasFilters && (
        <Button 
          variant="ghost" 
          onClick={onClear}
          className="h-9 px-3 text-zinc-500 hover:text-white gap-2 text-xs font-bold"
        >
          <X className="w-4 h-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
