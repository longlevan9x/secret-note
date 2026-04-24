"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { WorkspaceData, DEFAULT_WORKSPACE_DATA } from "@/core/schema/types";
import { LocalStorageAdapter } from "@/core/adapters/LocalStorageAdapter";
import { APP_CONFIG } from "@/core/constants/app";

interface WorkspaceContextProps {
  data: WorkspaceData | null;
  masterPassword: string | null;
  isLoaded: boolean;
  setMasterPassword: (password: string | null) => void;
  updateWorkspaceData: (newData: WorkspaceData) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

const adapter = new LocalStorageAdapter();

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [masterPassword, setMasterPasswordState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const loadedData = await adapter.load();
        if (loadedData) {
          setData(loadedData);
        } else {
          // Initialize with default if nothing exists
          setData(DEFAULT_WORKSPACE_DATA);
          await adapter.save(DEFAULT_WORKSPACE_DATA);
        }
      } catch (error) {
        console.error("Failed to load workspace data:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    initData();
  }, []);

  // Sync password with sessionStorage for convenience during dev/reload
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPwd = sessionStorage.getItem(APP_CONFIG.STORAGE_KEYS.MASTER_PASSWORD);
      if (storedPwd && !masterPassword) {
        setMasterPasswordState(storedPwd);
      }
    }
  }, [masterPassword]);

  const setMasterPassword = (password: string | null) => {
    setMasterPasswordState(password);
    if (typeof window !== "undefined") {
      if (password) {
        sessionStorage.setItem(APP_CONFIG.STORAGE_KEYS.MASTER_PASSWORD, password);
      } else {
        sessionStorage.removeItem(APP_CONFIG.STORAGE_KEYS.MASTER_PASSWORD);
      }
    }
  };

  const updateWorkspaceData = async (newData: WorkspaceData) => {
    setData(newData);
    await adapter.save(newData);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        data,
        masterPassword,
        isLoaded,
        setMasterPassword,
        updateWorkspaceData,
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
