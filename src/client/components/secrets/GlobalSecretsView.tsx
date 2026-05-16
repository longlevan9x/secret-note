"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/client/components/layout/DashboardShell";
import { useWorkspace } from "@/client/context/WorkspaceContext";
import { UpsertSecretDialog } from "@/client/components/projects/UpsertSecretDialog";
import { SecretsStats } from "./SecretsStats";
import { SecretsFilter } from "./SecretsFilter";
import { SecretsTable } from "./SecretsTable";
import { UsageExplorerDialog } from "./UsageExplorerDialog";
import { ServiceQuickViewDialog } from "./ServiceQuickViewDialog";
import { ConfirmDialog } from "@/client/components/ui/ConfirmDialog";
import type { Project, Secret, ServiceNode } from "@/shared/schema/types";
import type { SecretWithUsage } from "./types";

export function GlobalSecretsView() {
  const { data, deleteSecret } = useWorkspace();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [editingSecret, setEditingSecret] = useState<Secret | null>(null);
  const [targetProjectId, setTargetProjectId] = useState("");

  const [isUsageOpen, setIsUsageOpen] = useState(false);
  const [selectedSecretForUsage, setSelectedSecretForUsage] = useState<SecretWithUsage | null>(null);

  const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<ServiceNode | null>(null);
  const [serviceDetailContext, setServiceDetailContext] = useState<Project | null>(null);

  const [filterProject, setFilterProject] = useState("all");
  const [filterProvider, setFilterProvider] = useState("all");

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [secretToDelete, setSecretToDelete] = useState<{ projectId: string; key: string } | null>(null);

  const flattenedSecrets = useMemo<SecretWithUsage[]>(() => {
    if (!data?.projects) return [];

    return data.projects.flatMap((project) =>
      (project.secrets || []).map((secret) => ({
        ...secret,
        projectId: project.id,
        projectName: project.name,
        linkedServices: project.nodes.filter((node) => (node.secretKeys || []).includes(secret.key)),
      }))
    );
  }, [data]);

  const filteredSecrets = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    const normalizedProvider = filterProvider.toLowerCase();

    return flattenedSecrets.filter((secret) => {
      const matchesSearch =
        secret.key.toLowerCase().includes(normalizedSearch) ||
        secret.projectName.toLowerCase().includes(normalizedSearch) ||
        secret.note?.toLowerCase().includes(normalizedSearch);
      const matchesProject = filterProject === "all" || secret.projectId === filterProject;
      const matchesProvider =
        filterProvider === "all" ||
        secret.linkedServices.some((service) => service.provider.toLowerCase() === normalizedProvider);

      return matchesSearch && matchesProject && matchesProvider;
    });
  }, [filterProject, filterProvider, flattenedSecrets, searchTerm]);

  const projectsList = useMemo(() => {
    if (!data?.projects) return [];
    return data.projects.map((project) => ({ id: project.id, name: project.name }));
  }, [data]);

  const providersList = useMemo(() => {
    const providers = new Set<string>();
    flattenedSecrets.forEach((secret) => {
      secret.linkedServices.forEach((service) => providers.add(service.provider));
    });
    return Array.from(providers);
  }, [flattenedSecrets]);

  const toggleVisibility = (uniqueId: string) => {
    setVisibleSecrets((prev) => ({ ...prev, [uniqueId]: !prev[uniqueId] }));
  };

  const handleCopyValue = async (value: string, uniqueId: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(uniqueId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleEditSecret = (secret: SecretWithUsage) => {
    setEditingSecret({
      key: secret.key,
      value: secret.value,
      note: secret.note || "",
      lastRotated: secret.lastRotated,
    });
    setTargetProjectId(secret.projectId);
    setIsUpsertOpen(true);
  };

  const handleViewUsage = (secret: SecretWithUsage) => {
    setSelectedSecretForUsage(secret);
    setIsUsageOpen(true);
  };

  const handleViewServiceDetail = (service: ServiceNode, projectId: string) => {
    const project = data?.projects.find((p) => p.id === projectId) ?? null;
    setSelectedServiceForDetail(service);
    setServiceDetailContext(project);
    setIsServiceDetailOpen(true);
  };

  const handleDeleteRequest = (projectId: string, key: string) => {
    setSecretToDelete({ projectId, key });
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!secretToDelete) return;

    await deleteSecret(secretToDelete.projectId, secretToDelete.key);
    setIsDeleteConfirmOpen(false);
    setSecretToDelete(null);
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
          totalLinks={flattenedSecrets.reduce((acc, secret) => acc + secret.linkedServices.length, 0)}
          affectedProjects={new Set(flattenedSecrets.map((secret) => secret.projectId)).size}
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
        key={`${targetProjectId}:${editingSecret?.key ?? "new"}`}
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
