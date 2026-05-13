"use client";

import { useWorkspace } from "@/client/context/WorkspaceContext";
import { Project, Secret, ServiceNode } from "@/shared/schema/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui";
import { 
  LayoutGrid, 
  Activity, 
  Settings,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Copy,
  Check,
  ListFilter,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/client/hooks/use-toast";
import { ImportSecretsDialog } from "./ImportSecretsDialog";
import { UpsertSecretDialog } from "./UpsertSecretDialog";
import { AddServiceDialog } from "../services/AddServiceDialog";
import { ServiceDetail } from "../services/ServiceDetail";

type ViewMode = "all-secrets" | "by-service";

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const { addService, upsertSecret, batchUpsertSecrets, deleteSecret } = useWorkspace();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>("all-secrets");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    project.nodes[0]?.id || null
  );
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedService = project.nodes.find(s => s.id === selectedServiceId);

  // Get all project secrets and find which services are linked to each
  const allSecrets = (project.secrets || []).map(secret => {
    const linkedServices = project.nodes.filter(node => (node.secretKeys || []).includes(secret.key));
    return {
      ...secret,
      linkedServices
    };
  });

  const handleImportSecrets = async (secrets: Secret[]) => {
    // Import secrets to the project only, without linking to any specific service
    await batchUpsertSecrets(project.id, secrets);

    toast({
      title: "Secrets Imported",
      description: `Successfully imported ${secrets.length} secrets to the project repository.`,
    });
  };

  const handleUpsertSecret = async (secret: Secret, serviceId?: string) => {
    await upsertSecret(project.id, secret, serviceId);
    toast({
      title: "Secret Saved",
      description: `"${secret.key}" has been saved successfully.`,
    });
  };

  const handleDeleteSecret = async (key: string) => {
    if (confirm(`Are you sure you want to delete secret "${key}"? This will remove it from all linked services.`)) {
      await deleteSecret(project.id, key);
      toast({
        title: "Secret Deleted",
        description: `"${key}" has been removed from the project.`,
        variant: "destructive",
      });
    }
  };

  const handleAddService = async (serviceData: Omit<ServiceNode, "id">, initialSecrets?: Secret[]) => {
    const newService = await addService(project.id, serviceData, initialSecrets);
    if (newService) {
      setSelectedServiceId(newService.id);
      toast({
        title: "Service Created",
        description: `"${newService.name}" has been added to ${project.name}.`,
      });
    }
  };

  const toggleVisibility = (uniqueKey: string) => {
    setVisibleSecrets(prev => ({ ...prev, [uniqueKey]: !prev[uniqueKey] }));
  };

  const handleCopyValue = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Project Overview Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-zinc-900/50 border-zinc-800">
          <CardHeader className="py-4 px-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <CardTitle className="text-2xl font-black truncate">{project.name}</CardTitle>
                <CardDescription className="text-xs mt-1 opacity-70">
                  {project.description || "No description provided."}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ImportSecretsDialog onImport={handleImportSecrets} />
                <AddServiceDialog onAdd={handleAddService} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-4 px-6 border-t border-zinc-800/50">
             <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-primary" />
                  <span className="text-white">{project.nodes.length}</span> Services
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-white">{allSecrets.length}</span> Total Secrets
                </div>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 flex flex-col justify-center">
          <CardHeader className="py-3 px-6">
            <CardTitle className="text-[10px] uppercase tracking-[0.2em] opacity-50">Quick Management</CardTitle>
          </CardHeader>
          <CardContent className="py-3 px-6 space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3 text-xs h-9 bg-zinc-900/50" size="sm">
               <Settings className="w-4 h-4 text-muted-foreground" /> Project Settings
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 text-xs h-9 border-destructive/20 text-destructive hover:bg-destructive/10" size="sm">
               <Trash2 className="w-4 h-4" /> Delete Project
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <button
            onClick={() => setViewMode("all-secrets")}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
              viewMode === "all-secrets"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            All Secrets
          </button>
          <button
            onClick={() => setViewMode("by-service")}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
              viewMode === "by-service"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            By Service
          </button>
        </div>

        {viewMode === "all-secrets" && (
          <UpsertSecretDialog 
            projectId={project.id} 
            onUpsert={handleUpsertSecret} 
          />
        )}
      </div>

      {/* All Secrets View */}
      {viewMode === "all-secrets" && (
        <div className="border border-zinc-800 rounded-xl bg-zinc-950/50 overflow-hidden shadow-2xl animate-in fade-in duration-300">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="w-[200px] text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Variable Name</TableHead>
                <TableHead className="w-[120px] text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Service</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Value</TableHead>
                <TableHead className="w-[140px] text-right text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSecrets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic text-xs">
                    No secrets in this project yet. Add a service and start creating secrets.
                  </TableCell>
                </TableRow>
              ) : (
                allSecrets.map((secret) => {
                  const isVisible = visibleSecrets[secret.key];
                  return (
                    <TableRow key={secret.key} className="border-zinc-800 group hover:bg-zinc-900/40 transition-colors">
                      <TableCell className="font-mono text-sm">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-white">{secret.key}</span>
                          {secret.note && <span className="text-[10px] text-zinc-500 italic">{secret.note}</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {secret.linkedServices.map(service => (
                            <div key={service.id} className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-[9px] font-bold">
                              <div className={`w-1 h-1 rounded-full ${service.color || 'bg-primary'}`} />
                              <span className="text-zinc-400">{service.name}</span>
                            </div>
                          ))}
                          {secret.linkedServices.length === 0 && (
                            <span className="text-[9px] text-zinc-600 italic">Unlinked</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 px-3 h-9 flex items-center rounded bg-zinc-900/50 font-mono text-sm overflow-hidden border border-transparent group-hover:border-zinc-800/50 transition-all">
                            <span className={`truncate w-full ${isVisible ? "text-zinc-200" : "text-zinc-500"}`}>
                              {isVisible ? secret.value : "••••••••••••••••"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleVisibility(secret.key)}
                            className="h-8 w-8 hover:bg-zinc-800"
                          >
                            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyValue(secret.value, secret.key)}
                            className="h-8 w-8 hover:bg-zinc-800"
                          >
                            {copiedKey === secret.key ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </Button>
                          
                          <UpsertSecretDialog 
                            projectId={project.id} 
                            editingSecret={secret}
                            onUpsert={handleUpsertSecret}
                          />

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSecret(secret.key)}
                            className="h-8 w-8 hover:bg-destructive/10 text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* By Service View */}
      {viewMode === "by-service" && (
        <div className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-300">
          {/* Left: Service List */}
          <div className="w-full md:w-80 shrink-0">
            <div className="sticky top-0 space-y-4">
              <div className="flex items-center justify-between px-1">
                 <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Service Directory</Label>
              </div>
              <div className="flex flex-col gap-2">
                {project.nodes.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all text-left border group relative overflow-hidden ${
                      selectedServiceId === service.id 
                        ? "bg-primary border-primary text-primary-foreground shadow-2xl shadow-primary/40 scale-[1.02]" 
                        : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    {selectedServiceId === service.id && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    )}
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-sm font-bold truncate w-full">{service.name}</span>
                      <span className={`text-[10px] uppercase font-bold opacity-60 mt-0.5 ${selectedServiceId === service.id ? 'text-white' : ''}`}>
                        {service.env} · {(service.secretKeys || []).length} secrets
                      </span>
                    </div>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${selectedServiceId === service.id ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : (service.color || 'bg-primary')}`} />
                  </button>
                ))}
                {project.nodes.length === 0 && (
                  <Card className="p-8 border-dashed bg-transparent flex items-center justify-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">No Services Found</p>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Right: Service Detail */}
          <div className="flex-1 min-w-0">
            {selectedService ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${selectedService.color || 'bg-primary'} animate-pulse`} />
                    <h3 className="font-black text-lg tracking-tight truncate">{selectedService.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                     <ImportSecretsDialog onImport={handleImportSecrets} />
                     <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-colors" title="View Graph">
                        <ExternalLink className="w-4 h-4" />
                     </Button>
                  </div>
                </div>
                <div className="p-0">
                  <ServiceDetail 
                    service={selectedService} 
                    projectId={project.id} 
                    onDelete={() => setSelectedServiceId(project.nodes[0]?.id || null)}
                  />
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl text-muted-foreground gap-4 bg-zinc-900/10">
                 <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center">
                    <LayoutGrid className="w-6 h-6 opacity-20" />
                 </div>
                 <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Select a service to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
