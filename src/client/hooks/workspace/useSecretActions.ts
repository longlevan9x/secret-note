import { useCallback } from "react";
import { Secret, WorkspaceData } from "@/shared/schema/types";
import { IStorage } from "@/shared/interfaces/iStorage";

export const useSecretActions = (
  mutateWorkspace: (updater: (current: WorkspaceData) => WorkspaceData, persistFn: (data: WorkspaceData) => Promise<void>) => Promise<void>,
  adapter: IStorage
) => {
  const upsertSecret = useCallback(
    async (projectId: string, secret: Secret, serviceId?: string) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) => {
          if (project.id !== projectId) return project;
          const nextSecrets = [...(project.secrets || [])];
          const existingIndex = nextSecrets.findIndex((s) => s.key === secret.key);

          if (existingIndex >= 0) {
            nextSecrets[existingIndex] = { ...nextSecrets[existingIndex], ...secret };
          } else {
            nextSecrets.push(secret);
          }

          const nextNodes = project.nodes.map((node) => {
            if (serviceId && node.id === serviceId) {
              const secretKeys = [...(node.secretKeys || [])];
              if (!secretKeys.includes(secret.key)) {
                secretKeys.push(secret.key);
              }
              return { ...node, secretKeys };
            }
            return node;
          });

          return { ...project, secrets: nextSecrets, nodes: nextNodes };
        }),
      }), () => adapter.upsertSecret(projectId, secret, serviceId));
    },
    [mutateWorkspace, adapter]
  );

  const batchUpsertSecrets = useCallback(
    async (projectId: string, secrets: Secret[], serviceId?: string) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) => {
          if (project.id !== projectId) return project;
          const nextSecrets = [...(project.secrets || [])];
          const newKeys = secrets.map(s => s.key);

          for (const secret of secrets) {
            const existingIndex = nextSecrets.findIndex((s) => s.key === secret.key);
            if (existingIndex >= 0) {
              nextSecrets[existingIndex] = { ...nextSecrets[existingIndex], ...secret };
            } else {
              nextSecrets.push(secret);
            }
          }

          const nextNodes = project.nodes.map((node) => {
            if (serviceId && node.id === serviceId) {
              const secretKeys = [...(node.secretKeys || [])];
              newKeys.forEach(key => {
                if (!secretKeys.includes(key)) {
                  secretKeys.push(key);
                }
              });
              return { ...node, secretKeys };
            }
            return node;
          });

          return { ...project, secrets: nextSecrets, nodes: nextNodes };
        }),
      }), () => adapter.batchUpsertSecrets(projectId, secrets, serviceId));
    },
    [mutateWorkspace, adapter]
  );

  const deleteSecret = useCallback(
    async (projectId: string, secretKey: string) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) => {
          if (project.id !== projectId) return project;
          return {
            ...project,
            secrets: (project.secrets || []).filter((s) => s.key !== secretKey),
            nodes: project.nodes.map((node) => ({
              ...node,
              secretKeys: (node.secretKeys || []).filter((k) => k !== secretKey),
            })),
          };
        }),
      }), () => adapter.deleteSecret(projectId, secretKey));
    },
    [mutateWorkspace, adapter]
  );

  const linkSecretToService = useCallback(
    async (projectId: string, serviceId: string, secretKey: string) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) => {
          if (project.id !== projectId) return project;
          return {
            ...project,
            nodes: project.nodes.map((node) => {
              if (node.id !== serviceId) return node;
              const secretKeys = [...(node.secretKeys || [])];
              if (!secretKeys.includes(secretKey)) {
                secretKeys.push(secretKey);
              }
              return { ...node, secretKeys };
            }),
          };
        }),
      }), (next) => {
        const project = next.projects.find(p => p.id === projectId);
        return adapter.updateProject(projectId, project!);
      });
    },
    [mutateWorkspace, adapter]
  );

  const unlinkSecretFromService = useCallback(
    async (projectId: string, serviceId: string, secretKey: string) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) => {
          if (project.id !== projectId) return project;
          return {
            ...project,
            nodes: project.nodes.map((node) => {
              if (node.id !== serviceId) return node;
              return {
                ...node,
                secretKeys: (node.secretKeys || []).filter((k) => k !== secretKey),
              };
            }),
          };
        }),
      }), (next) => {
        const project = next.projects.find(p => p.id === projectId);
        return adapter.updateProject(projectId, project!);
      });
    },
    [mutateWorkspace, adapter]
  );

  return {
    upsertSecret,
    batchUpsertSecrets,
    deleteSecret,
    linkSecretToService,
    unlinkSecretFromService,
  };
};
