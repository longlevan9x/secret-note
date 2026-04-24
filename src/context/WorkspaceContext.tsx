"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  AppSettings,
  DEFAULT_WORKSPACE_DATA,
  DEFAULT_WORKSPACE_METADATA,
  Project,
  Secret,
  ServiceNode,
  ServiceTemplate,
  StorageConfig,
  WorkspaceData,
} from "@/core/schema/types";
import { LocalStorageAdapter } from "@/core/adapters/LocalStorageAdapter";
import { GitHubAdapter } from "@/core/adapters/GitHubAdapter";
import { SupabaseAdapter } from "@/core/adapters/SupabaseAdapter";
import { APP_CONFIG } from "@/core/constants/app";
import { IStorage } from "@/core/interfaces/IStorage";
import { createValidationHash, deriveKey, verifyMasterKey } from "@/core/security/crypto";

interface WorkspaceContextProps {
  data: WorkspaceData | null;
  masterPassword: string | null;
  isLoaded: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isSyncing: boolean;
  error: string | null;
  storageConfig: StorageConfig;
  setMasterPassword: (password: string | null) => void;
  updateWorkspaceData: (newData: WorkspaceData) => Promise<void>;
  updateStorageConfig: (config: StorageConfig) => void;
  syncData: () => Promise<void>;
  unlockVault: (password: string) => boolean;
  setupMasterPassword: (password: string) => Promise<void>;
  addProject: (name: string) => Promise<Project | null>;
  removeProject: (projectId: string) => Promise<void>;
  updateProject: (projectId: string, updater: Project | ((project: Project) => Project)) => Promise<void>;
  addService: (projectId: string, service: Omit<ServiceNode, "id">) => Promise<ServiceNode | null>;
  updateService: (projectId: string, serviceId: string, updater: ServiceNode | ((service: ServiceNode) => ServiceNode)) => Promise<void>;
  removeService: (projectId: string, serviceId: string) => Promise<void>;
  upsertSecret: (projectId: string, serviceId: string, secret: Secret) => Promise<void>;
  deleteSecret: (projectId: string, serviceId: string, secretKey: string) => Promise<void>;
  toggleDependency: (projectId: string, serviceId: string, dependencyId: string) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  setProjectPosition: (projectId: string, position: { x: number; y: number }) => Promise<void>;
  setProjectSize: (projectId: string, size: { width: number; height: number }) => Promise<void>;
  setServicePosition: (projectId: string, serviceId: string, position: { x: number; y: number }) => Promise<void>;
  addCustomTemplate: (template: ServiceTemplate) => Promise<void>;
  removeCustomTemplate: (templateId: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  type: "local",
};

const AUTO_LOCK_TIMEOUT = 15 * 60 * 1000;

const buildWorkspaceSnapshot = (data: WorkspaceData, storageConfig: StorageConfig): WorkspaceData => {
  const now = new Date().toISOString();

  return {
    ...data,
    metadata: {
      storage: {
        ...DEFAULT_WORKSPACE_METADATA.storage,
        ...data.metadata?.storage,
        activeType: storageConfig.type,
        lastSavedAt: data.metadata?.storage?.lastSavedAt,
        lastLoadedAt: data.metadata?.storage?.lastLoadedAt,
      },
      sync: {
        ...DEFAULT_WORKSPACE_METADATA.sync,
        ...data.metadata?.sync,
      },
      health: {
        ...DEFAULT_WORKSPACE_METADATA.health,
        ...data.metadata?.health,
        checkedAt: data.metadata?.health?.checkedAt ?? now,
      },
    },
  };
};

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [masterPassword, setMasterPasswordState] = useState<string | null>(null);
  const [storageConfig, setStorageConfig] = useState<StorageConfig>(() => {
    if (typeof window === "undefined") return DEFAULT_STORAGE_CONFIG;

    const savedConfig = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.STORAGE_CONFIG);
    if (!savedConfig) return DEFAULT_STORAGE_CONFIG;

    try {
      return JSON.parse(savedConfig) as StorageConfig;
    } catch (storageError) {
      console.error("Failed to parse storage config", storageError);
      return DEFAULT_STORAGE_CONFIG;
    }
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setMasterPassword = (password: string | null) => {
    setMasterPasswordState(password);

    if (typeof window === "undefined") return;

    if (password) {
      sessionStorage.setItem(APP_CONFIG.STORAGE_KEYS.MASTER_PASSWORD, password);
    } else {
      sessionStorage.removeItem(APP_CONFIG.STORAGE_KEYS.MASTER_PASSWORD);
    }
  };

  const adapter = useMemo<IStorage>(() => {
    switch (storageConfig.type) {
      case "github":
        if (storageConfig.github) {
          return new GitHubAdapter(
            storageConfig.github.token,
            storageConfig.github.repo,
            storageConfig.github.path,
            storageConfig.github.branch
          );
        }
        break;
      case "supabase":
        if (storageConfig.supabase) {
          return new SupabaseAdapter(
            storageConfig.supabase.url,
            storageConfig.supabase.key,
            storageConfig.supabase.workspaceId
          );
        }
        break;
    }

    return new LocalStorageAdapter();
  }, [storageConfig]);

  const persistWorkspace = useCallback(
    async (nextData: WorkspaceData) => {
      const snapshot = buildWorkspaceSnapshot(nextData, storageConfig);
      const snapshotWithSaveMeta: WorkspaceData = {
        ...snapshot,
        metadata: {
          ...snapshot.metadata!,
          storage: {
            ...snapshot.metadata!.storage,
            lastSavedAt: new Date().toISOString(),
          },
        },
      };

      setIsSaving(true);
      setError(null);

      try {
        await adapter.save(snapshotWithSaveMeta);
        setData(snapshotWithSaveMeta);
      } catch (saveError) {
        const message = saveError instanceof Error ? saveError.message : "Failed to save workspace data.";
        setError(message);
        throw saveError;
      } finally {
        setIsSaving(false);
      }
    },
    [adapter, storageConfig]
  );

  const mutateWorkspace = useCallback(
    async (updater: (current: WorkspaceData) => WorkspaceData) => {
      if (!data) return;
      const nextData = updater(data);
      await persistWorkspace(nextData);
    },
    [data, persistWorkspace]
  );

  const initData = useCallback(async () => {
    setIsLoading(true);
    setIsLoaded(false);
    setError(null);

    try {
      const loadedData = await adapter.load();

      if (loadedData) {
        const snapshot = buildWorkspaceSnapshot(loadedData, storageConfig);
        setData({
          ...snapshot,
          metadata: {
            ...snapshot.metadata!,
            storage: {
              ...snapshot.metadata!.storage,
              lastLoadedAt: new Date().toISOString(),
            },
          },
        });
      } else {
        setData(buildWorkspaceSnapshot(DEFAULT_WORKSPACE_DATA, storageConfig));
      }

      if (typeof window !== "undefined") {
        const storedPwd = sessionStorage.getItem(APP_CONFIG.STORAGE_KEYS.MASTER_PASSWORD);
        if (storedPwd) {
          const workspaceToValidate = loadedData ?? DEFAULT_WORKSPACE_DATA;
          if (!workspaceToValidate.validationHash) {
            setMasterPasswordState(storedPwd);
          } else {
            const derived = deriveKey(storedPwd);
            if (verifyMasterKey(workspaceToValidate.validationHash, derived)) {
              setMasterPasswordState(storedPwd);
            } else {
              sessionStorage.removeItem(APP_CONFIG.STORAGE_KEYS.MASTER_PASSWORD);
            }
          }
        }
      }
    } catch (loadError) {
      console.error("Failed to load workspace data:", loadError);
      setError(loadError instanceof Error ? loadError.message : "Failed to load workspace data.");
      setData(buildWorkspaceSnapshot(DEFAULT_WORKSPACE_DATA, storageConfig));
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, [adapter, storageConfig]);

  useEffect(() => {
    void Promise.resolve().then(initData);
  }, [initData]);

  useEffect(() => {
    if (!masterPassword) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setMasterPasswordState(null);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(APP_CONFIG.STORAGE_KEYS.MASTER_PASSWORD);
        }
      }, AUTO_LOCK_TIMEOUT);
    };

    const events = ["mousedown", "keydown", "touchstart", "mousemove"];
    events.forEach((eventName) => window.addEventListener(eventName, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((eventName) => window.removeEventListener(eventName, resetTimer));
    };
  }, [masterPassword]);

  const updateWorkspaceData = useCallback(
    async (newData: WorkspaceData) => {
      await persistWorkspace(newData);
    },
    [persistWorkspace]
  );

  const updateStorageConfig = useCallback((config: StorageConfig) => {
    setStorageConfig(config);

    if (typeof window !== "undefined") {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.STORAGE_CONFIG, JSON.stringify(config));
    }
  }, []);

  const syncData = useCallback(async () => {
    setIsSyncing(true);
    setError(null);

    try {
      if (adapter.sync) {
        await adapter.sync();
      }

      await initData();
      setData((current) =>
        current
          ? {
              ...current,
              metadata: {
                ...current.metadata!,
                sync: {
                  ...current.metadata!.sync,
                  status: "success",
                  lastSyncedAt: new Date().toISOString(),
                  lastError: undefined,
                },
              },
            }
          : current
      );
    } catch (syncError) {
      const message = syncError instanceof Error ? syncError.message : "Failed to sync workspace data.";
      setError(message);
      setData((current) =>
        current
          ? {
              ...current,
              metadata: {
                ...current.metadata!,
                sync: {
                  ...current.metadata!.sync,
                  status: "error",
                  lastError: message,
                },
              },
            }
          : current
      );
      throw syncError;
    } finally {
      setIsSyncing(false);
    }
  }, [adapter, initData]);

  const unlockVault = (password: string): boolean => {
    if (!data?.validationHash) return false;

    const derived = deriveKey(password);
    if (!verifyMasterKey(data.validationHash, derived)) {
      return false;
    }

    setMasterPassword(password);
    return true;
  };

  const setupMasterPassword = async (password: string) => {
    if (!data) return;

    const derived = deriveKey(password);
    const validationHash = createValidationHash(derived);
    await persistWorkspace({
      ...data,
      validationHash,
    });
    setMasterPassword(password);
  };

  const addProject = useCallback(
    async (name: string) => {
      if (!data || !name.trim()) return null;

      const newProject: Project = {
        id: crypto.randomUUID(),
        name: name.trim(),
        nodes: [],
      };

      await persistWorkspace({
        ...data,
        projects: [...data.projects, newProject],
      });

      return newProject;
    },
    [data, persistWorkspace]
  );

  const removeProject = useCallback(
    async (projectId: string) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.filter((project) => project.id !== projectId),
      }));
    },
    [mutateWorkspace]
  );

  const updateProject = useCallback(
    async (projectId: string, updater: Project | ((project: Project) => Project)) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) => {
          if (project.id !== projectId) return project;
          return typeof updater === "function" ? updater(project) : updater;
        }),
      }));
    },
    [mutateWorkspace]
  );

  const addService = useCallback(
    async (projectId: string, service: Omit<ServiceNode, "id">) => {
      if (!data) return null;

      const newService: ServiceNode = {
        id: crypto.randomUUID(),
        ...service,
      };

      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === projectId
            ? { ...project, nodes: [...project.nodes, newService] }
            : project
        ),
      }));

      return newService;
    },
    [data, mutateWorkspace]
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
      }));
    },
    [mutateWorkspace]
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
      }));
    },
    [mutateWorkspace]
  );

  const upsertSecret = useCallback(
    async (projectId: string, serviceId: string, secret: Secret) => {
      await updateService(projectId, serviceId, (service) => {
        const existingIndex = service.secrets.findIndex((item) => item.key === secret.key);
        const nextSecrets = [...service.secrets];

        if (existingIndex >= 0) {
          nextSecrets[existingIndex] = secret;
        } else {
          nextSecrets.push(secret);
        }

        return {
          ...service,
          secrets: nextSecrets,
        };
      });
    },
    [updateService]
  );

  const deleteSecret = useCallback(
    async (projectId: string, serviceId: string, secretKey: string) => {
      await updateService(projectId, serviceId, (service) => ({
        ...service,
        secrets: service.secrets.filter((secret) => secret.key !== secretKey),
      }));
    },
    [updateService]
  );

  const toggleDependency = useCallback(
    async (projectId: string, serviceId: string, dependencyId: string) => {
      await updateService(projectId, serviceId, (service) => {
        const dependsOn = service.dependsOn.includes(dependencyId)
          ? service.dependsOn.filter((id) => id !== dependencyId)
          : [...service.dependsOn, dependencyId];

        return {
          ...service,
          dependsOn,
        };
      });
    },
    [updateService]
  );

  const updateSettings = useCallback(
    async (settings: Partial<AppSettings>) => {
      await mutateWorkspace((current) => ({
        ...current,
        settings: {
          ...current.settings,
          ...settings,
        },
      }));
    },
    [mutateWorkspace]
  );

  const setProjectPosition = useCallback(
    async (projectId: string, position: { x: number; y: number }) => {
      await updateProject(projectId, (project) => ({ ...project, position }));
    },
    [updateProject]
  );

  const setProjectSize = useCallback(
    async (projectId: string, size: { width: number; height: number }) => {
      await updateProject(projectId, (project) => ({ ...project, size }));
    },
    [updateProject]
  );

  const setServicePosition = useCallback(
    async (projectId: string, serviceId: string, position: { x: number; y: number }) => {
      await updateService(projectId, serviceId, (service) => ({ ...service, position }));
    },
    [updateService]
  );

  const addCustomTemplate = async (template: ServiceTemplate) => {
    if (!data) return;
    const nextData = {
      ...data,
      customTemplates: [...(data.customTemplates || []), template],
    };
    setData(nextData);
    await persistWorkspace(nextData);
  };

  const removeCustomTemplate = async (templateId: string) => {
    if (!data) return;
    const nextData = {
      ...data,
      customTemplates: (data.customTemplates || []).filter(t => t.providerId !== templateId),
    };
    setData(nextData);
    await persistWorkspace(nextData);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        data,
        masterPassword,
        isLoaded,
        isLoading,
        isSaving,
        isSyncing,
        error,
        storageConfig,
        setMasterPassword,
        updateWorkspaceData,
        updateStorageConfig,
        syncData,
        unlockVault,
        setupMasterPassword,
        addProject,
        removeProject,
        updateProject,
        addService,
        updateService,
        removeService,
        upsertSecret,
        deleteSecret,
        toggleDependency,
        updateSettings,
        setProjectPosition,
        setProjectSize,
        setServicePosition,
        addCustomTemplate,
        removeCustomTemplate,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
