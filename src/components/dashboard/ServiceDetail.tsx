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
  TabsTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui";
import { useState } from "react";
import Image from "next/image";
import { decryptSecret, encryptSecret } from "@/core/security/crypto";
import { 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff, 
  Check, 
  Save, 
  Settings2,
  Pencil,
  Key,
  Share2,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface ServiceDetailProps {
  service: ServiceNode;
  projectId: string;
  onDelete?: () => void;
}

import ReactMarkdown from "react-markdown";

export function ServiceDetail({ service, projectId, onDelete }: ServiceDetailProps) {
  const {
    data,
    masterPassword,
    updateService,
    upsertSecret,
    deleteSecret,
    removeService,
    toggleDependency,
  } = useWorkspace();
  const { toast } = useToast();
  const [imgError, setImgError] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newNote, setNewNote] = useState("");
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [localDescription, setLocalDescription] = useState(service.description || "");
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [editName, setEditName] = useState(service.name);
  const [editEnv] = useState(service.env);
  const [editingSecretKey, setEditingSecretKey] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Dialog State
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "service" | "secret";
    key?: string;
  } | null>(null);

  const getDecryptedValue = (encryptedValue: string) => {
    if (!masterPassword) return "ERROR_NO_PASSWORD";
    return decryptSecret(encryptedValue, masterPassword);
  };

  const handleAddSecret = async () => {
    if (!newKey.trim() || !newValue.trim() || !masterPassword || !data) return;

    const encryptedValue = encryptSecret(newValue, masterPassword);
    
    const newSecret: Secret = {
      key: newKey,
      value: encryptedValue,
      note: newNote,
      lastRotated: new Date().toISOString(),
    };

    await upsertSecret(projectId, service.id, newSecret);

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

  const executeDeleteSecret = async (key: string) => {
    await deleteSecret(projectId, service.id, key);
    toast({
      title: "Secret Deleted",
      description: `"${key}" has been removed.`,
    });
  };

  const executeDeleteService = async () => {
    await removeService(projectId, service.id);
    toast({
      title: "Service Deleted",
      description: `"${service.name}" has been removed.`,
    });
    onDelete?.();
  };

  const handleUpdateMetadata = async () => {
    if (!editName.trim()) return;

    await updateService(projectId, service.id, (currentService) => ({
      ...currentService,
      name: editName,
      env: editEnv,
    }));

    setIsEditingMetadata(false);
    toast({
      title: "Service Updated",
      description: "Service metadata has been updated successfully.",
    });
  };

  const toggleVisibility = (key: string) => {
    setVisibleSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <div className="flex flex-col gap-6 p-8 bg-zinc-900/50 min-h-full">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700 shadow-xl overflow-hidden relative group">
              {service.icon && !imgError ? (
                <Image 
                  src={`https://cdn.simpleicons.org/${service.icon}`}
                  alt={service.name}
                  width={64}
                  height={64}
                  className="object-contain p-3"
                  unoptimized
                  onError={() => setImgError(true)}
                />
              ) : !imgError ? (
                <Image 
                  src={`https://logo.clearbit.com/${service.name.toLowerCase().replace(/\s+/g, '')}.com`}
                  alt={service.name}
                  width={64}
                  height={64}
                  className="object-contain p-2"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="text-2xl font-black text-primary/40 uppercase">
                  {service.name.substring(0, 2)}
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              {isEditingMetadata ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-8 w-48 bg-zinc-950"
                  />
                  <Button size="sm" onClick={handleUpdateMetadata}>
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-black tracking-tight text-white">{service.name}</h1>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditingMetadata(true)} className="h-6 w-6">
                    <Pencil className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                  {service.env}
                </span>
                <span className="text-xs text-muted-foreground">
                  ID: <code className="text-zinc-500">{service.id}</code>
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setConfirmDelete({ type: "service" })}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Service
            </Button>
          </div>
        </div>

        <Tabs defaultValue="secrets" className="w-full">
          <TabsList className="bg-zinc-950 border border-zinc-800 p-1 mb-6">
            <TabsTrigger value="secrets" className="gap-2">
              <Key className="w-4 h-4" />
              Secrets
            </TabsTrigger>
            <TabsTrigger value="dependencies" className="gap-2">
              <Share2 className="w-4 h-4" />
              Dependencies
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings2 className="w-4 h-4" />
              Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="secrets" className="space-y-8 animate-in fade-in duration-500">
            {/* Secrets Table */}
            <div className="border border-zinc-800 rounded-xl bg-zinc-950/50 overflow-hidden shadow-2xl">
              <Table>
                <TableHeader className="bg-zinc-900/50">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="w-[250px] text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Variable Name</TableHead>
                    <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Secret Value</TableHead>
                    <TableHead className="w-[100px] text-right text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {service.secrets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-32 text-center text-muted-foreground italic">
                        No secrets stored for this service.
                      </TableCell>
                    </TableRow>
                  ) : (
                    service.secrets.map((secret) => (
                      <TableRow key={secret.key} className="border-zinc-800 group hover:bg-zinc-900/40 transition-colors">
                        <TableCell className="font-mono text-sm text-zinc-300">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-white">{secret.key}</span>
                            {secret.note && <span className="text-[10px] text-zinc-500 italic">{secret.note}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 px-3 h-9 flex items-center rounded bg-zinc-900/50 font-mono text-sm transition-all duration-300 overflow-hidden border border-transparent group-hover:border-zinc-800/50">
                              <span className={`truncate w-full ${visibleSecrets[secret.key] ? "text-zinc-200" : "text-zinc-500"}`}>
                                {visibleSecrets[secret.key] ? getDecryptedValue(secret.value) : "••••••••••••••••"}
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => toggleVisibility(secret.key)}
                              className="h-8 w-8 hover:bg-zinc-800"
                            >
                              {visibleSecrets[secret.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" onClick={() => handleEditSecret(secret)} className="h-8 w-8">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setConfirmDelete({ type: "secret", key: secret.key })} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Add/Edit Secret Form */}
            <Card id="secret-form" className="bg-zinc-950 border-zinc-800 shadow-xl overflow-hidden">
              <CardHeader className="bg-zinc-900/30 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  {editingSecretKey ? <Settings2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                  {editingSecretKey ? "Edit Secret" : "Add New Secret"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-zinc-500">Key Name</Label>
                    <Input 
                      placeholder="e.g. DATABASE_URL" 
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      className="bg-zinc-900 border-zinc-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-zinc-500">Value</Label>
                    <Input 
                      type="password"
                      placeholder="Sensitive value..." 
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="bg-zinc-900 border-zinc-800"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-zinc-500">Internal Note (Optional)</Label>
                  <Input 
                    placeholder="Brief note about this secret..." 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 h-10"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  {editingSecretKey && (
                    <Button variant="outline" onClick={() => {
                      setNewKey("");
                      setNewValue("");
                      setNewNote("");
                      setEditingSecretKey(null);
                    }}>Cancel</Button>
                  )}
                  <Button onClick={handleAddSecret} className="gap-2 font-bold px-8">
                    <Save className="w-4 h-4" />
                    {editingSecretKey ? "Update Secret" : "Save Secret"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dependencies" className="animate-in fade-in duration-500">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle>Service Dependencies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-white">Manage Relationships</p>
                    <p className="text-xs text-muted-foreground">Select other services that this service depends on to visualize relationships on the graph.</p>
                  </div>
                  
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {data?.projects.map((project) => {
                      const otherNodes = project.nodes.filter((n) => n.id !== service.id);
                      if (otherNodes.length === 0) return null;

                      return (
                        <div key={project.id} className="space-y-2">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">
                            Project: {project.name}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {otherNodes.map((node) => {
                              const isSelected = service.dependsOn.includes(node.id);
                              return (
                                <button
                                  key={node.id}
                                  onClick={() => toggleDependency(projectId, service.id, node.id)}
                                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                    isSelected 
                                      ? "bg-primary/10 border-primary text-white shadow-lg shadow-primary/10" 
                                      : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900"
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    isSelected ? "bg-primary border-primary" : "border-zinc-700"
                                  }`}>
                                    {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[4]" />}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold truncate">{node.name}</span>
                                    <span className="text-[10px] opacity-60 uppercase">{node.provider} - {node.env}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {data?.projects.every(p => p.nodes.length === (p.id === projectId ? 1 : 0)) && (
                      <p className="text-xs text-zinc-500 italic py-8 text-center">No other services available in the workspace to link.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="animate-in fade-in duration-500">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Service Documentation</CardTitle>
                <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                  <Button 
                    variant={!isPreviewMode ? "secondary" : "ghost"} 
                    size="sm" 
                    className="h-7 text-[10px] uppercase tracking-wider font-bold"
                    onClick={() => setIsPreviewMode(false)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant={isPreviewMode ? "secondary" : "ghost"} 
                    size="sm" 
                    className="h-7 text-[10px] uppercase tracking-wider font-bold"
                    onClick={() => setIsPreviewMode(true)}
                  >
                    Preview
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  {isPreviewMode ? (
                    <div className="min-h-[120px] p-4 rounded-md border border-zinc-800 bg-zinc-900/20 prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{localDescription || "_No documentation provided yet._"}</ReactMarkdown>
                    </div>
                  ) : (
                    <Textarea 
                      value={localDescription}
                      onChange={(e) => setLocalDescription(e.target.value)}
                      onBlur={async () => {
                        await updateService(projectId, service.id, (s) => ({ ...s, description: localDescription }));
                      }}
                      placeholder="Use Markdown to document this service... (e.g. # API Endpoints, **Bold**, etc.)"
                      className="bg-zinc-900 border-zinc-800 min-h-[120px] font-mono text-sm"
                    />
                  )}
                </div>
                
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-white">Service Appearance</p>
                      <p className="text-xs text-muted-foreground">Choose a custom color for this service on the graph.</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {[
                      "#3b82f6", // Blue
                      "#10b981", // Emerald
                      "#f59e0b", // Amber
                      "#ef4444", // Red
                      "#8b5cf6", // Violet
                      "#ec4899", // Pink
                      "#71717a", // Zinc
                    ].map((c) => (
                      <button
                        key={c}
                        onClick={async () => {
                          await updateService(projectId, service.id, (s) => ({ ...s, color: c }));
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          service.color === c ? "border-white scale-110 shadow-lg shadow-white/20" : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <div className="flex items-center gap-2 ml-auto">
                      <Label className="text-[10px] uppercase font-bold text-zinc-500">Custom Hex</Label>
                      <Input 
                        value={service.color || ""}
                        onChange={async (e) => {
                          await updateService(projectId, service.id, (s) => ({ ...s, color: e.target.value }));
                        }}
                        placeholder="#000000"
                        className="h-8 w-24 text-xs font-mono bg-zinc-950 border-zinc-800"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmDialog 
        isOpen={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete?.type === "service") {
            executeDeleteService();
          } else if (confirmDelete?.type === "secret") {
            executeDeleteSecret(confirmDelete.key!);
          }
        }}
        title={`Delete ${confirmDelete?.type === "service" ? "Service" : "Secret"}`}
        description={`Are you sure you want to delete this ${confirmDelete?.type}? This action cannot be undone.`}
      />
    </>
  );
}
