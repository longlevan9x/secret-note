"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/client/components/layout/DashboardShell";
import { useWorkspace } from "@/client/context/WorkspaceContext";

// UI Components
import { UpsertSecretDialog } from "@/client/components/projects/UpsertSecretDialog";

// Sub-components
import { SecretsStats } from "@/client/components/secrets/SecretsStats";
import { SecretsFilter } from "@/client/components/secrets/SecretsFilter";
import { SecretsTable } from "@/client/components/secrets/SecretsTable";
import { UsageExplorerDialog } from "@/client/components/secrets/UsageExplorerDialog";
import { ServiceQuickViewDialog } from "@/client/components/secrets/ServiceQuickViewDialog";
import { ConfirmDialog } from "@/client/components/ui";

export default function GlobalSecretsPage() {
  const { data, deleteSecret } = useWorkspace();
  const router = useRouter();
  
  // App states
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Modal states
  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [editingSecret, setEditingSecret] = useState<any>(null);
  const [targetProjectId, setTargetProjectId] = useState<string>("");

  const [isUsageOpen, setIsUsageOpen] = useState(false);
  const [selectedSecretForUsage, setSelectedSecretForUsage] = useState<any>(null);

  const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<any>(null);
  const [serviceDetailContext, setServiceDetailContext] = useState<any>(null);

  // Filter state
  const [filterProject, setFilterProject] = useState("all");
  const [filterProvider, setFilterProvider] = useState("all");

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [secretToDelete, setSecretToDelete] = useState<{projectId: string, key: string} | null>(null);

  // Logic: Flatten secrets
  const flattenedSecrets = useMemo(() => {
    if (!data?.projects) return [];
    const secrets: any[] = [];
    data.projects.forEach(project => {
      (project.secrets || []).forEach(secret => {
        const linkedServices = project.nodes.filter(node => 
          (node.secretKeys || []).includes(secret.key)
        );
        secrets.push({
          ...secret,
          projectId: project.id,
          projectName: project.name,
          linkedServices
        });
      });
    });
    return secrets;
  }, [data]);

  // Logic: Filter secrets
  const filteredSecrets = useMemo(() => {
    return flattenedSecrets.filter(s => {
      const matchesSearch = s.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.note?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProject = filterProject === "all" || s.projectId === filterProject;
      const matchesProvider = filterProvider === "all" || 
                              s.linkedServices.some((svc: any) => svc.provider.toLowerCase() === filterProvider.toLowerCase());
      return matchesSearch && matchesProject && matchesProvider;
    });
  }, [flattenedSecrets, searchTerm, filterProject, filterProvider]);

  // Logic: Unique lists for filters
  const projectsList = useMemo(() => {
    if (!data?.projects) return [];
    return data.projects.map(p => ({ id: p.id, name: p.name }));
  }, [data]);

  const providersList = useMemo(() => {
    const providers = new Set<string>();
    flattenedSecrets.forEach(s => {
      s.linkedServices.forEach((svc: any) => providers.add(svc.provider));
    });
    return Array.from(providers);
  }, [flattenedSecrets]);

  // Handlers
  const toggleVisibility = (uniqueId: string) => {
    setVisibleSecrets(prev => ({ ...prev, [uniqueId]: !prev[uniqueId] }));
  };

  const handleCopyValue = async (value: string, uniqueId: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(uniqueId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleEditSecret = (secret: any) => {
    setEditingSecret({
      key: secret.key,
      value: secret.value,
      note: secret.note || ""
    });
    setTargetProjectId(secret.projectId);
    setIsUpsertOpen(true);
  };

  const handleViewUsage = (secret: any) => {
    setSelectedSecretForUsage(secret);
    setIsUsageOpen(true);
  };

  const handleViewServiceDetail = (service: any, projectId: string) => {
    const project = data?.projects.find(p => p.id === projectId);
    setSelectedServiceForDetail(service);
    setServiceDetailContext(project);
    setIsServiceDetailOpen(true);
  };

  const handleDeleteRequest = (projectId: string, key: string) => {
    setSecretToDelete({ projectId, key });
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (secretToDelete) {
      await deleteSecret(secretToDelete.projectId, secretToDelete.key);
      setIsDeleteConfirmOpen(false);
      setSecretToDelete(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterProject("all");
    setFilterProvider("all");
  };

  return (
    <DashboardShell title="All Secrets">
      <div className="flex flex-col gap-6 animate-in fade-in duration-500">
        
        <SecretsStats 
          totalKeys={flattenedSecrets.length}
          totalLinks={flattenedSecrets.reduce((acc, s) => acc + s.linkedServices.length, 0)}
          affectedProjects={new Set(flattenedSecrets.map(s => s.projectId)).size}
        />

        <SecretsFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterProject={filterProject}
          setFilterProject={setFilterProject}
          filterProvider={filterProvider}
          setFilterProvider={setFilterProvider}
          projectsList={projectsList}
          providersList={providersList}
          onClear={clearFilters}
        />

        <SecretsTable 
          secrets={filteredSecrets}
          visibleSecrets={visibleSecrets}
          copiedKey={copiedKey}
          onToggleVisibility={toggleVisibility}
          onCopy={handleCopyValue}
          onEdit={handleEditSecret}
          onViewUsage={handleViewUsage}
          onDelete={handleDeleteRequest}
        />
      </div>

      <UpsertSecretDialog
        open={isUpsertOpen}
        onOpenChange={setIsUpsertOpen}
        projectId={targetProjectId}
        editingSecret={editingSecret}
      />

      <UsageExplorerDialog 
        isOpen={isUsageOpen}
        onOpenChange={setIsUsageOpen}
        secret={selectedSecretForUsage}
        onViewServiceDetail={handleViewServiceDetail}
        onGoToProject={(id) => {
          setIsUsageOpen(false);
          router.push(`/projects?id=${id}`);
        }}
      />

      <ServiceQuickViewDialog 
        isOpen={isServiceDetailOpen}
        onOpenChange={setIsServiceDetailOpen}
        service={selectedServiceForDetail}
        projectContext={serviceDetailContext}
      />

      <ConfirmDialog 
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Secret"
        description={`Are you sure you want to delete "${secretToDelete?.key}"? This action cannot be undone and may break services using this secret.`}
        confirmText="Delete Secret"
        onConfirm={confirmDelete}
        variant="danger"
      />
    </DashboardShell>
  );
}
