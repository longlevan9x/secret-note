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
} from "@/shared/schema/types";
import { ApiAdapter } from "@/shared/adapters/apiAdapter";
import { APP_CONFIG } from "@/shared/constants/app";
import { IStorage } from "@/shared/interfaces/iStorage";

// Import custom hooks
import { useProjectActions } from "../hooks/workspace/useProjectActions";
import { useServiceActions } from "../hooks/workspace/useServiceActions";
import { useSecretActions } from "../hooks/workspace/useSecretActions";
import { useTemplateActions, useSettingsActions } from "../hooks/workspace/useMiscActions";

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
  unlockVault: (password: string) => Promise<boolean>;
  addProject: (data: { name: string; description?: string; icon?: string }) => Promise<Project | null>;
  removeProject: (projectId: string) => Promise<void>;
  updateProject: (projectId: string, updater: Project | ((project: Project) => Project)) => Promise<void>;
  addService: (projectId: string, service: Omit<ServiceNode, "id">, initialSecrets?: Secret[]) => Promise<ServiceNode | null>;
  updateService: (projectId: string, serviceId: string, updater: ServiceNode | ((service: ServiceNode) => ServiceNode)) => Promise<void>;
  removeService: (projectId: string, serviceId: string) => Promise<void>;
  upsertSecret: (projectId: string, secret: Secret, serviceId?: string) => Promise<void>;
  batchUpsertSecrets: (projectId: string, secrets: Secret[], serviceId?: string) => Promise<void>;
  deleteSecret: (projectId: string, secretKey: string) => Promise<void>;
  linkSecretToService: (projectId: string, serviceId: string, secretKey: string) => Promise<void>;
  unlinkSecretFromService: (projectId: string, serviceId: string, secretKey: string) => Promise<void>;
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
  id: "default",
  name: "Personal Vault",
  type: "local",
};

const buildWorkspaceSnapshot = (data: WorkspaceData, storageConfig: StorageConfig): WorkspaceData => {
  const now = new Date().toISOString();
  return {
    ...data,
    metadata: {
      storage: {
        ...DEFAULT_WORKSPACE_METADATA.storage,
        ...data.metadata?.storage,
        activeType: storageConfig.type || "local",
      },
      sync: { ...DEFAULT_WORKSPACE_METADATA.sync, ...data.metadata?.sync },
      health: {
        ...DEFAULT_WORKSPACE_METADATA.health,
        ...data.metadata?.health,
        checkedAt: data.metadata?.health?.checkedAt ?? now,
      },
    },
  };
};

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setDataState] = useState<WorkspaceData | null>(null);
  const dataRef = React.useRef<WorkspaceData | null>(null);

  const setData = useCallback((newData: WorkspaceData | null | ((prev: WorkspaceData | null) => WorkspaceData | null)) => {
    setDataState(prev => {
      const result = typeof newData === 'function' ? newData(prev) : newData;
      dataRef.current = result;
      return result;
    });
  }, []);

  const [masterPassword, setMasterPasswordState] = useState<string | null>(null);
  const [storageConfig, setStorageConfig] = useState<StorageConfig>(() => {
    if (typeof window === "undefined") return DEFAULT_STORAGE_CONFIG;
    const savedConfig = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.STORAGE_CONFIG);
    return savedConfig ? JSON.parse(savedConfig) : DEFAULT_STORAGE_CONFIG;
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adapter = useMemo<IStorage>(() => new ApiAdapter(), []);

  const initData = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);
    setIsLoaded(false);
    setError(null);
    try {
      const loadedData = await adapter.load();
      if (loadedData) {
        setData(buildWorkspaceSnapshot(loadedData, storageConfig));
      } else {
        setData(buildWorkspaceSnapshot(DEFAULT_WORKSPACE_DATA, storageConfig));
      }
      if (typeof window !== "undefined") {
        const storedPwd = sessionStorage.getItem(APP_CONFIG.STORAGE_KEYS.MASTER_PASSWORD);
        if (storedPwd) setMasterPasswordState(storedPwd);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load data.");
      setData(buildWorkspaceSnapshot(DEFAULT_WORKSPACE_DATA, storageConfig));
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, [adapter, storageConfig, setData]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void initData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [initData]);

  const persistWorkspace = useCallback(async (nextData: WorkspaceData) => {
    const snapshot = buildWorkspaceSnapshot(nextData, storageConfig);
    setIsSaving(true);
    setError(null);
    try {
      await adapter.save(snapshot);
      setData(snapshot);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed.");
      throw saveError;
    } finally {
      setIsSaving(false);
    }
  }, [adapter, storageConfig, setData]);

  const mutateWorkspace = useCallback(async (updater: (current: WorkspaceData) => WorkspaceData, persistFn: (data: WorkspaceData) => Promise<void>) => {
    const currentData = dataRef.current;
    if (!currentData) return;
    const nextData = updater(currentData);
    setData(nextData);
    try {
      await persistFn(nextData);
    } catch (e) {
      console.error("Mutation failed", e);
      await initData();
    }
  }, [initData, setData]);

  // Actions from Hooks
  const projectActions = useProjectActions(dataRef, setData, adapter, mutateWorkspace);
  const serviceActions = useServiceActions(mutateWorkspace, adapter);
  const secretActions = useSecretActions(mutateWorkspace, adapter);
  const templateActions = useTemplateActions(mutateWorkspace, adapter);
  const settingsActions = useSettingsActions(mutateWorkspace, adapter);

  const updateWorkspaceData = useCallback(async (newData: WorkspaceData) => {
    setData(newData);
    await persistWorkspace(newData);
  }, [persistWorkspace, setData]);

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
      if (adapter.sync) await adapter.sync();
      await initData();
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : "Sync failed.");
    } finally {
      setIsSyncing(false);
    }
  }, [adapter, initData]);

  const setMasterPassword = useCallback((password: string | null) => {
    setMasterPasswordState(password);
    if (typeof window === "undefined") return;
    if (password) sessionStorage.setItem(APP_CONFIG.STORAGE_KEYS.MASTER_PASSWORD, password);
    else sessionStorage.removeItem(APP_CONFIG.STORAGE_KEYS.MASTER_PASSWORD);
  }, []);

  const unlockVault = useCallback(async (password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/projects", { // Updated endpoint
        headers: { "Authorization": `Bearer ${password}` }
      });
      if (res.ok) {
        setMasterPassword(password);
        await initData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [initData, setMasterPassword]);

  const contextValue = useMemo<WorkspaceContextProps>(() => ({
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
    ...projectActions,
    ...serviceActions,
    ...secretActions,
    ...templateActions,
    ...settingsActions,
  }), [
    data,
    error,
    isLoaded,
    isLoading,
    isSaving,
    isSyncing,
    masterPassword,
    projectActions,
    secretActions,
    serviceActions,
    setMasterPassword,
    settingsActions,
    storageConfig,
    syncData,
    templateActions,
    unlockVault,
    updateStorageConfig,
    updateWorkspaceData,
  ]);

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return context;
};
