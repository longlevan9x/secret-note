"use client";

import { useWorkspace } from "@/client/context/WorkspaceContext";
import { useToast } from "@/client/hooks/use-toast";
import { Secret, ServiceNode } from "@/shared/schema/types";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  Label,
} from "@/client/components/ui";
import { useState } from "react";
import { 
  Key, 
  Share2, 
  Settings2,
  Plus,
} from "lucide-react";
import { ConfirmDialog } from "@/client/components/ui/ConfirmDialog";

// Sub-components
import { ServiceHeader } from "./ServiceHeader";
import { SecretTable } from "./SecretTable";
import { SecretForm } from "./SecretForm";
import { DependencyManager } from "./DependencyManager";
import { DocumentationManager } from "./DocumentationManager";

interface ServiceDetailProps {
  service: ServiceNode;
  projectId: string;
  onDelete?: () => void;
}

export function ServiceDetail({ service, projectId, onDelete }: ServiceDetailProps) {
  const {
    data,
    updateService,
    upsertSecret,
    deleteSecret,
    removeService,
    toggleDependency,
    unlinkSecretFromService,
    linkSecretToService,
  } = useWorkspace();
  const { toast } = useToast();
  
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newNote, setNewNote] = useState("");
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [localDescription, setLocalDescription] = useState(service.description || "");
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [editName, setEditName] = useState(service.name);
  const [editingSecretKey, setEditingSecretKey] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Dialog State
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "service" | "secret";
    key?: string;
  } | null>(null);

  const handleAddSecret = async () => {
    if (!newKey.trim() || !newValue.trim() || !data) return;
    
    const newSecret: Secret = {
      key: newKey,
      value: newValue,
      note: newNote,
      lastRotated: new Date().toISOString(),
    };

    await upsertSecret(projectId, newSecret, service.id);

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
    setNewValue(secret.value);
    setNewNote(secret.note || "");
    setEditingSecretKey(secret.key);
    
    document.getElementById("secret-form")?.scrollIntoView({ behavior: 'smooth' });
  };

  const executeDeleteSecret = async (key: string) => {
    await unlinkSecretFromService(projectId, service.id, key);
    toast({
      title: "Secret Unlinked",
      description: `"${key}" has been unlinked from this service.`,
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
    }));

    setIsEditingMetadata(false);
    toast({
      title: "Service Updated",
      description: "Service metadata has been updated successfully.",
    });
  };

  const handleUpdateColor = async (color: string) => {
    await updateService(projectId, service.id, (s) => ({ ...s, color }));
  };

  const toggleVisibility = (key: string) => {
    setVisibleSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentProject = data?.projects.find(p => p.id === projectId);
  const serviceSecrets = (currentProject?.secrets || []).filter(s => 
    (service.secretKeys || []).includes(s.key)
  );
  
  const availableSecrets = (currentProject?.secrets || []).filter(s => 
    !(service.secretKeys || []).includes(s.key)
  );

  return (
    <>
      <div className="flex flex-col gap-6 p-8 bg-zinc-900/50 min-h-full">
        <ServiceHeader 
          service={service}
          isEditingMetadata={isEditingMetadata}
          editName={editName}
          setEditName={setEditName}
          setIsEditingMetadata={setIsEditingMetadata}
          handleUpdateMetadata={handleUpdateMetadata}
          setConfirmDelete={setConfirmDelete}
        />

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
            <SecretTable 
              secrets={serviceSecrets}
              visibleSecrets={visibleSecrets}
              toggleVisibility={toggleVisibility}
              handleEditSecret={handleEditSecret}
              setConfirmDelete={setConfirmDelete}
            />
            
            {availableSecrets.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Link Existing Secrets</Label>
                  <p className="text-[10px] text-zinc-500 italic">Reuse secrets from other services in this project.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {availableSecrets.map(s => (
                    <Button 
                      key={s.key} 
                      variant="outline" 
                      size="sm" 
                      className="justify-start gap-2 h-9 bg-zinc-900/30 border-zinc-800 hover:border-primary/50 transition-all text-[11px]"
                      onClick={() => {
                        linkSecretToService(projectId, service.id, s.key);
                        toast({
                          title: "Secret Linked",
                          description: `"${s.key}" is now available to this service.`,
                        });
                      }}
                    >
                      <Plus className="w-3 h-3 text-primary" />
                      <span className="truncate">{s.key}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <SecretForm 
              editingSecretKey={editingSecretKey}
              newKey={newKey}
              setNewKey={setNewKey}
              newValue={newValue}
              setNewValue={setNewValue}
              newNote={newNote}
              setNewNote={setNewNote}
              handleAddSecret={handleAddSecret}
              setEditingSecretKey={setEditingSecretKey}
            />
          </TabsContent>

          <TabsContent value="dependencies" className="animate-in fade-in duration-500">
            <DependencyManager 
              data={data}
              serviceId={service.id}
              projectId={projectId}
              dependsOn={service.dependsOn}
              toggleDependency={toggleDependency}
            />
          </TabsContent>

          <TabsContent value="settings" className="animate-in fade-in duration-500">
            <DocumentationManager 
              isPreviewMode={isPreviewMode}
              setIsPreviewMode={setIsPreviewMode}
              localDescription={localDescription}
              setLocalDescription={setLocalDescription}
              serviceColor={service.color || ""}
              handleUpdateColor={handleUpdateColor}
              handleDescriptionBlur={async () => {
                await updateService(projectId, service.id, (s) => ({ ...s, description: localDescription }));
              }}
            />
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
