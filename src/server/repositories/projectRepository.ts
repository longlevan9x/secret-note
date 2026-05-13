import { workspaceStorage } from "../storage/storageFactory";
import { Project, WorkspaceData } from "@/shared/schema/types";

export class ProjectRepository {
  async findAll(): Promise<WorkspaceData | null> {
    return await workspaceStorage.load();
  }

  async create(project: Project): Promise<void> {
    await workspaceStorage.addProject(project);
  }

  async update(id: string, updates: Partial<Project>): Promise<void> {
    await workspaceStorage.updateProject(id, updates);
  }

  async delete(id: string): Promise<void> {
    await workspaceStorage.removeProject(id);
  }

  async updatePosition(id: string, x: number, y: number): Promise<void> {
    await workspaceStorage.setPosition(id, { x, y });
  }

  async saveAll(data: WorkspaceData): Promise<void> {
    await workspaceStorage.save(data);
  }
}

export const projectRepository = new ProjectRepository();
