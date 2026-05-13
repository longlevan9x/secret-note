import { useCallback } from "react";
import { ServiceNode, Secret, WorkspaceData } from "@/shared/schema/types";
import { IStorage } from "@/shared/interfaces/iStorage";

export const useServiceActions = (
  mutateWorkspace: (updater: (current: WorkspaceData) => WorkspaceData, persistFn: (data: WorkspaceData) => Promise<void>) => Promise<void>,
  adapter: IStorage
) => {
  const addService = useCallback(
    async (projectId: string, service: Omit<ServiceNode, "id">, initialSecrets: Secret[] = []) => {
      const newServiceId = crypto.randomUUID();
      const secretKeys = initialSecrets.map(s => s.key);

      const newService: ServiceNode = {
        id: newServiceId,
        ...service,
        secretKeys,
      };

      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) => {
          if (project.id !== projectId) return project;

          const existingSecrets = project.secrets || [];
          const nextSecrets = [...existingSecrets];
          
          initialSecrets.forEach(newSecret => {
            const exists = nextSecrets.some(s => s.key === newSecret.key);
            if (!exists) {
              nextSecrets.push(newSecret);
            }
          });

          return { 
            ...project, 
            secrets: nextSecrets,
            nodes: [...project.nodes, newService] 
          };
        }),
      }), () => adapter.addService(projectId, newService, initialSecrets));

      return newService;
    },
    [mutateWorkspace, adapter]
  );

  const updateService = useCallback(
    async (projectId: string, serviceId: string, updater: ServiceNode | ((service: ServiceNode) => ServiceNode)) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) => {
          if (project.id !== projectId) return project;

          return {
            ...project,
            nodes: project.nodes.map((service) => {
              if (service.id !== serviceId) return service;
              return typeof updater === "function" ? updater(service) : updater;
            }),
          };
        }),
      }), (next) => {
        const project = next.projects.find(p => p.id === projectId);
        const service = project?.nodes.find(n => n.id === serviceId);
        return adapter.updateService(projectId, serviceId, service!);
      });
    },
    [mutateWorkspace, adapter]
  );

  const removeService = useCallback(
    async (projectId: string, serviceId: string) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) => ({
          ...project,
          nodes:
            project.id === projectId
              ? project.nodes.filter((service) => service.id !== serviceId)
              : project.nodes.map((service) => ({
                  ...service,
                  dependsOn: service.dependsOn.filter((dependencyId) => dependencyId !== serviceId),
                })),
        })),
      }), () => adapter.removeService(projectId, serviceId));
    },
    [mutateWorkspace, adapter]
  );

  const setServicePosition = useCallback(
    async (projectId: string, serviceId: string, position: { x: number; y: number }) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) => {
          if (project.id !== projectId) return project;
          return {
            ...project,
            nodes: project.nodes.map((n) => n.id === serviceId ? { ...n, position } : n)
          };
        }),
      }), () => adapter.setPosition(projectId, position, serviceId));
    },
    [mutateWorkspace, adapter]
  );

  const toggleDependency = useCallback(
    async (projectId: string, serviceId: string, dependencyId: string) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) => {
          if (project.id !== projectId) return project;
          return {
            ...project,
            nodes: project.nodes.map((node) => {
              if (node.id !== serviceId) return node;
              const dependsOn = node.dependsOn.includes(dependencyId)
                ? node.dependsOn.filter((id) => id !== dependencyId)
                : [...node.dependsOn, dependencyId];
              return { ...node, dependsOn };
            }),
          };
        }),
      }), (next) => {
        const project = next.projects.find(p => p.id === projectId);
        const service = project?.nodes.find(n => n.id === serviceId);
        return adapter.updateService(projectId, serviceId, service!);
      });
    },
    [mutateWorkspace, adapter]
  );

  return {
    addService,
    updateService,
    removeService,
    setServicePosition,
    toggleDependency,
  };
};
