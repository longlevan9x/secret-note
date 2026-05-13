import { useCallback } from "react";
import { Project, WorkspaceData } from "@/shared/schema/types";
import { IStorage } from "@/shared/interfaces/iStorage";

export const useProjectActions = (
  dataRef: React.MutableRefObject<WorkspaceData | null>,
  setData: (newData: WorkspaceData | null | ((prev: WorkspaceData | null) => WorkspaceData | null)) => void,
  adapter: IStorage,
  mutateWorkspace: (updater: (current: WorkspaceData) => WorkspaceData, persistFn: (data: WorkspaceData) => Promise<void>) => Promise<void>
) => {
  const addProject = useCallback(
    async (projectData: { name: string; description?: string; icon?: string }) => {
      const newProject: Project = {
        id: crypto.randomUUID(),
        name: projectData.name.trim(),
        description: projectData.description,
        icon: projectData.icon,
        secrets: [],
        nodes: [],
      };

      await mutateWorkspace((current) => ({
        ...current,
        projects: [...current.projects, newProject],
      }), () => adapter.addProject(newProject));

      return newProject;
    },
    [mutateWorkspace, adapter]
  );

  const removeProject = useCallback(
    async (projectId: string) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.filter((project) => project.id !== projectId),
      }), () => adapter.removeProject(projectId));
    },
    [mutateWorkspace, adapter]
  );

  const updateProject = useCallback(
    async (projectId: string, updater: Project | ((project: Project) => Project)) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) => {
          if (project.id !== projectId) return project;
          return typeof updater === "function" ? updater(project) : updater;
        }),
      }), (next) => {
        const project = next.projects.find(p => p.id === projectId);
        return adapter.updateProject(projectId, project!);
      });
    },
    [mutateWorkspace, adapter]
  );

  const setProjectPosition = useCallback(
    async (projectId: string, position: { x: number; y: number }) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) => {
          if (project.id !== projectId) return project;
          return { ...project, position };
        }),
      }), () => adapter.setPosition(projectId, position));
    },
    [mutateWorkspace, adapter]
  );

  const setProjectSize = useCallback(
    async (projectId: string, size: { width: number; height: number }) => {
      await mutateWorkspace((current) => ({
        ...current,
        projects: current.projects.map((project) => {
          if (project.id !== projectId) return project;
          return { ...project, size };
        }),
      }), (next) => {
        const project = next.projects.find(p => p.id === projectId);
        return adapter.updateProject(projectId, project!);
      });
    },
    [mutateWorkspace, adapter]
  );

  return {
    addProject,
    removeProject,
    updateProject,
    setProjectPosition,
    setProjectSize,
  };
};
