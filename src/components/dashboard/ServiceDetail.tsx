"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import { useToast } from "@/hooks/use-toast";
import { Secret, ServiceNode } from "@/core/schema/types";
import { 
  Button, 
  Input, 
  Label, 
  Textarea, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui";
import { useState, useEffect } from "react";
import Image from "next/image";
import { decryptSecret, encryptSecret } from "@/core/security/crypto";
import { 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Save, 
  ArrowLeft,
  Download,
  Upload,
  Link2,
  Globe,
  Settings2,
  Pencil
} from "lucide-react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { UI_TEXT } from "@/core/constants/app";

interface ServiceDetailProps {
  service: ServiceNode;
  projectId: string;
  onDelete?: () => void;
}

export function ServiceDetail({ service, projectId, onDelete }: ServiceDetailProps) {
  const { data, updateWorkspaceData, masterPassword } = useWorkspace();
  const { toast } = useToast();
  const [imgError, setImgError] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newNote, setNewNote] = useState("");
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [localDescription, setLocalDescription] = useState(service.description || "");
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [editName, setEditName] = useState(service.name);
  const [editEnv, setEditEnv] = useState(service.env);
  const [editingSecretKey, setEditingSecretKey] = useState<string | null>(null);

  // Sync local state when service changes
  useEffect(() => {
    setLocalDescription(service.description || "");
    setEditName(service.name);
    setEditEnv(service.env);
  }, [service.id, service.description, service.name, service.env]);

  const handleAddSecret = () => {
    if (!newKey.trim() || !newValue.trim() || !masterPassword || !data) return;

    const encryptedValue = encryptSecret(newValue, masterPassword);
    
    // If editing, we might be changing the key name too
    let updatedSecrets = [...service.secrets];
    
    if (editingSecretKey) {
      const index = updatedSecrets.findIndex(s => s.key === editingSecretKey);
      if (index >= 0) {
        updatedSecrets[index] = {
          key: newKey, // Use newKey in case it was renamed
          value: encryptedValue,
          note: newNote,
          lastRotated: new Date().toISOString(),
        };
      }
    } else {
      const existingIndex = service.secrets.findIndex(s => s.key === newKey);
      if (existingIndex >= 0) {
        updatedSecrets[existingIndex] = {
          ...updatedSecrets[existingIndex],
          value: encryptedValue,
          note: newNote || updatedSecrets[existingIndex].note,
          lastRotated: new Date().toISOString(),
        };
      } else {
        updatedSecrets.push({
          key: newKey,
          value: encryptedValue,
          note: newNote,
          lastRotated: new Date().toISOString(),
        });
      }
    }

    updateService({
      ...service,
      secrets: updatedSecrets,
    });

    setNewKey("");
    setNewValue("");
    setNewNote("");
    setEditingSecretKey(null);
    toast({
      title: editingSecretKey ? "Secret Updated" : "Secret Saved",
      description: `"${newKey}" has been ${editingSecretKey ? 'updated' : 'saved'} successfully.`,
    });
  };

  const handleEditSecret = (secret: Secret) => {
    setNewKey(secret.key);
    setNewValue(getDecryptedValue(secret.value));
    setNewNote(secret.note || "");
    setEditingSecretKey(secret.key);
    
    // Scroll to form
    document.getElementById("secret-form")?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteSecret = async (keyToDelete: string) => {
    if (!data) return;
    await updateService({
      ...service,
      secrets: service.secrets.filter(s => s.key !== keyToDelete),
    });
    toast({
      title: "Secret Deleted",
      description: `"${keyToDelete}" has been removed.`,
    });
  };

  const handleDeleteService = async () => {
    if (!data) return;
    const updatedProjects = data.projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          nodes: p.nodes.filter(n => n.id !== service.id),
        };
      }
      return p;
    });

    await updateWorkspaceData({ ...data, projects: updatedProjects });
    toast({
      title: "Service Deleted",
      description: `"${service.name}" has been removed.`,
    });
    onDelete?.();
  };

  const updateService = (updatedService: ServiceNode) => {
    if (!data) return;

    const updatedProjects = data.projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          nodes: p.nodes.map(n => n.id === updatedService.id ? updatedService : n),
        };
      }
      return p;
    });

    updateWorkspaceData({ ...data, projects: updatedProjects });
  };

  const toggleVisibility = (key: string) => {
    setVisibleSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getDecryptedValue = (encryptedValue: string) => {
    if (!masterPassword) return "ERROR_NO_PASSWORD";
    return decryptSecret(encryptedValue, masterPassword);
  };

  const handleUpdateMetadata = async () => {
    if (!data || !editName.trim()) return;

    const updatedProjects = data.projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          nodes: p.nodes.map((n) => 
            n.id === service.id 
              ? { ...n, name: editName, env: editEnv } 
              : n
          )
        };
      }
      return p;
    });

    await updateWorkspaceData({ ...data, projects: updatedProjects });
    setIsEditingMetadata(false);
    
    toast({
      title: "Service Updated",
      description: "Name and environment have been successfully updated.",
    });
  };

  const handleToggleDependency = async (targetServiceId: string) => {
    if (!data) return;

    const currentDependsOn = service.dependsOn || [];
    const isDependent = currentDependsOn.includes(targetServiceId);
    
    const newDependsOn = isDependent
      ? currentDependsOn.filter(id => id !== targetServiceId)
      : [...currentDependsOn, targetServiceId];

    const updatedProjects = data.projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          nodes: p.nodes.map((n) => n.id === service.id ? { ...n, dependsOn: newDependsOn } : n)
        };
      }
      return p;
    });

    await updateWorkspaceData({ ...data, projects: updatedProjects });
    
    toast({
      title: isDependent ? "Dependency Removed" : "Dependency Added",
      description: "Service dependencies updated successfully.",
    });
  };

  const allServices = data?.projects.flatMap(p => p.nodes) || [];
  const otherServices = allServices.filter(s => s.id !== service.id);
  
  // Count only existing services that are in dependsOn
  const activeDependencyCount = (service.dependsOn || []).filter(id => 
    allServices.some(s => s.id === id)
  ).length;

  const handleExportEnv = () => {
    if (!masterPassword) {
      toast({
        title: "Export Failed",
        description: "Please unlock your workspace first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const envContent = service.secrets
        .map(s => {
          const value = decryptSecret(s.value, masterPassword);
          return `${s.key}=${value}`;
        })
        .join("\n");

      const blob = new Blob([envContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${service.name.toLowerCase().replace(/\s+/g, "-")}.env`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Downloaded ${service.name}.env`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An error occurred during decryption.",
        variant: "destructive",
      });
    }
  };

  const handleImportEnv = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !masterPassword || !data) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const lines = content.split(/\r?\n/);
      const newSecrets: Secret[] = [...service.secrets];
      let addedCount = 0;

      lines.forEach(line => {
        const [key, ...valueParts] = line.split("=");
        if (key && valueParts.length > 0) {
          const trimmedKey = key.trim();
          const value = valueParts.join("=").trim().replace(/^["']|["']$/g, ""); // Remove quotes
          
          if (trimmedKey && value) {
            const encryptedValue = encryptSecret(value, masterPassword);
            const existingIndex = newSecrets.findIndex(s => s.key === trimmedKey);
            
            if (existingIndex >= 0) {
              newSecrets[existingIndex] = {
                ...newSecrets[existingIndex],
                value: encryptedValue,
                lastRotated: new Date().toISOString()
              };
            } else {
              newSecrets.push({
                key: trimmedKey,
                value: encryptedValue,
                lastRotated: new Date().toISOString()
              });
            }
            addedCount++;
          }
        }
      });

      const updatedProjects = data.projects.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            nodes: p.nodes.map((n) => n.id === service.id ? { ...n, secrets: newSecrets } : n)
          };
        }
        return p;
      });

      await updateWorkspaceData({ ...data, projects: updatedProjects });
      
      toast({
        title: "Import Successful",
        description: `Imported ${addedCount} variables from .env`,
      });
      
      // Reset input
      event.target.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full p-6 pb-20 gap-6">
      <div className="flex items-center gap-4">
        {service.icon && !imgError ? (
          <Image 
            src={`https://cdn.simpleicons.org/${service.icon}`} 
            alt={service.name} 
            width={48}
            height={48}
            className="w-12 h-12"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xl font-bold uppercase">
            {service.provider[0]}
          </div>
        )}
        <div className="flex-1">
          {isEditingMetadata ? (
            <div className="flex flex-col gap-2">
              <Input 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-9 text-lg font-bold w-[350px]"
                placeholder="Project Name"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase font-bold text-[10px]">Env:</span>
                <Input 
                  value={editEnv}
                  onChange={(e) => setEditEnv(e.target.value)}
                  className="h-7 text-xs w-[120px]"
                  placeholder="Environment"
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold">{service.name}</h2>
              <p className="text-muted-foreground">{service.provider} | Environment: {service.env}</p>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isEditingMetadata && (
            <>
              <Button variant="outline" size="sm" onClick={() => document.getElementById("env-import")?.click()} className="gap-2">
                <Upload className="w-3.5 h-3.5" />
                Import .env
              </Button>
              <input 
                id="env-import" 
                type="file" 
                accept=".env,text/plain" 
                className="hidden" 
                onChange={handleImportEnv}
              />
              <Button variant="outline" size="sm" onClick={handleExportEnv} className="gap-2">
                <Download className="w-3.5 h-3.5" />
                Export .env
              </Button>
            </>
          )}
          {isEditingMetadata ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => setIsEditingMetadata(false)}>Cancel</Button>
              <Button size="sm" onClick={handleUpdateMetadata}>Save</Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditingMetadata(true)}>Edit Info</Button>
          )}
        </div>
        <DeleteConfirmDialog 
          title="Delete Service"
          description={UI_TEXT.DELETE_SERVICE_CONFIRM(service.name)}
          onConfirm={handleDeleteService}
          trigger={
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          }
        />
      </div>

      <Tabs defaultValue="secrets" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="secrets" className="gap-2">
            <Settings2 className="w-4 h-4" />
            Secrets & Notes
          </TabsTrigger>
          <TabsTrigger value="dependencies" className="gap-2">
            <Link2 className="w-4 h-4" />
            Dependencies ({activeDependencyCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="secrets" className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Notes / Description</Label>
            <Textarea 
              value={localDescription} 
              onChange={(e) => setLocalDescription(e.target.value)}
              onBlur={() => {
                if (localDescription !== service.description) {
                  // handleSaveDescription logic would go here, using handleUpdateMetadata pattern
                  const updatedProjects = data?.projects.map((p) => {
                    if (p.id === projectId) {
                      return {
                        ...p,
                        nodes: p.nodes.map((n) => n.id === service.id ? { ...n, description: localDescription } : n)
                      };
                    }
                    return p;
                  });
                  if (updatedProjects) updateWorkspaceData({ ...data!, projects: updatedProjects });
                }
              }}
              placeholder="Add more information about this service..."
              className="resize-none min-h-[80px] bg-muted/20"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Environment Variables</Label>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">AES-256 Encrypted</span>
            </div>
            
            <div className="border rounded-xl overflow-hidden bg-background shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-xs">Key</TableHead>
                    <TableHead className="text-xs">Value</TableHead>
                    <TableHead className="text-right text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {service.secrets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10 text-muted-foreground italic text-sm">
                        No secrets added yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {service.secrets.map((secret) => {
                    const isVisible = visibleSecrets[secret.key];
                    return (
                      <TableRow key={secret.key} className="group transition-colors hover:bg-muted/30">
                        <TableCell className="font-mono font-bold text-sm text-primary">{secret.key}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {isVisible ? getDecryptedValue(secret.value) : "••••••••••••••••••••"}
                        </TableCell>
                        <TableCell className="text-right flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => toggleVisibility(secret.key)}
                            title="Toggle Visibility"
                          >
                            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEditSecret(secret)}
                            title="Edit Secret"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <DeleteConfirmDialog 
                            title="Delete Secret"
                            description={`Are you sure you want to delete "${secret.key}"?`}
                            onConfirm={() => {
                              const updatedSecrets = service.secrets.filter(s => s.key !== secret.key);
                              const updatedProjects = data?.projects.map((p) => {
                                if (p.id === projectId) {
                                  return {
                                    ...p,
                                    nodes: p.nodes.map((n) => n.id === service.id ? { ...n, secrets: updatedSecrets } : n)
                                  };
                                }
                                return p;
                              });
                              if (updatedProjects) updateWorkspaceData({ ...data!, projects: updatedProjects });
                            }}
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div id="secret-form" className="pt-4 border-t space-y-4 scroll-mt-20">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">{editingSecretKey ? 'Update Secret' : 'Add New Secret'}</h4>
                {editingSecretKey && (
                  <Button variant="ghost" size="xs" onClick={() => {
                    setEditingSecretKey(null);
                    setNewKey("");
                    setNewValue("");
                    setNewNote("");
                  }}>Cancel Edit</Button>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="key" className="text-[10px] uppercase text-muted-foreground">Key</Label>
                    <Input 
                      id="key" 
                      placeholder="DATABASE_URL" 
                      value={newKey} 
                      onChange={e => setNewKey(e.target.value.toUpperCase())}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value" className="text-[10px] uppercase text-muted-foreground">Value</Label>
                    <Input 
                      id="value" 
                      type="password" 
                      placeholder="Enter value..." 
                      value={newValue} 
                      onChange={e => setNewValue(e.target.value)} 
                    />
                  </div>
                </div>
                <div className="flex gap-3 items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="note" className="text-[10px] uppercase text-muted-foreground">Note / Description (Optional)</Label>
                    <Input 
                      id="note" 
                      placeholder="Usage: Connection string for production DB" 
                      value={newNote} 
                      onChange={e => setNewNote(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddSecret} className={`h-10 px-6 ${editingSecretKey ? 'bg-amber-600 hover:bg-amber-700' : ''}`}>
                    {editingSecretKey ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {editingSecretKey ? 'Update Secret' : 'Add Secret'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">Service Architecture</h3>
              <p className="text-sm text-muted-foreground">Define which services this component depends on to function. This will update the system graph.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {otherServices.length === 0 ? (
                <div className="py-14 text-center border-2 border-dashed rounded-2xl text-muted-foreground bg-muted/10">
                  <Link2 className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p>No other services available to link.</p>
                </div>
              ) : (
                otherServices.map((other) => {
                  const isLinked = service.dependsOn?.includes(other.id);
                  return (
                    <div 
                      key={other.id}
                      className={`group flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isLinked 
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                          : 'border-transparent bg-muted/30 hover:bg-muted/50 hover:border-muted'
                      }`}
                      onClick={() => handleToggleDependency(other.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-background shadow-sm transition-transform group-active:scale-95`}>
                          {other.icon ? (
                            <Image 
                              src={`https://cdn.simpleicons.org/${other.icon}`} 
                              alt={other.name} 
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain"
                              unoptimized
                            />
                          ) : (
                            <div className="w-6 h-6 flex items-center justify-center text-[10px] font-bold text-primary">
                              {other.provider[0]}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{other.name}</span>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            {data?.projects.find(p => p.nodes.some(n => n.id === other.id))?.name} 
                            <span className="opacity-30">•</span> {other.provider} 
                            <span className="opacity-30">•</span> {other.env}
                          </span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isLinked 
                          ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' 
                          : 'border-muted-foreground/20 bg-background'
                      }`}>
                        {isLinked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
