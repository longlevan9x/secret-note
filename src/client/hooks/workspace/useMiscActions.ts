import { useCallback } from "react";
import { ServiceTemplate, AppSettings, WorkspaceData } from "@/shared/schema/types";
import { IStorage } from "@/shared/interfaces/iStorage";

export const useTemplateActions = (
  mutateWorkspace: (updater: (current: WorkspaceData) => WorkspaceData, persistFn: (data: WorkspaceData) => Promise<void>) => Promise<void>,
  adapter: IStorage
) => {
  const addCustomTemplate = useCallback(
    async (template: ServiceTemplate) => {
      await mutateWorkspace((current) => ({
        ...current,
        customTemplates: [...(current.customTemplates || []), template],
      }), (next) => adapter.save(next));
    },
    [mutateWorkspace, adapter]
  );

  const removeCustomTemplate = useCallback(
    async (templateId: string) => {
      await mutateWorkspace((current) => ({
        ...current,
        customTemplates: (current.customTemplates || []).filter(t => t.providerId !== templateId),
      }), (next) => adapter.save(next));
    },
    [mutateWorkspace, adapter]
  );

  return { addCustomTemplate, removeCustomTemplate };
};

export const useSettingsActions = (
  mutateWorkspace: (updater: (current: WorkspaceData) => WorkspaceData, persistFn: (data: WorkspaceData) => Promise<void>) => Promise<void>,
  adapter: IStorage
) => {
  const updateSettings = useCallback(
    async (settings: Partial<AppSettings>) => {
      await mutateWorkspace((current) => ({
        ...current,
        settings: {
          ...current.settings,
          ...settings,
        },
      }), (next) => adapter.save(next));
    },
    [mutateWorkspace, adapter]
  );

  return { updateSettings };
};
