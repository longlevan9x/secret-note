import { StorageFactory } from "../storage/storageFactory";
import { Project, WorkspaceData } from "@/shared/schema/types";

export class ProjectRepository {
  async findAll(): Promise<WorkspaceData | null> {
    const storage = await StorageFactory.getStorage();
    return storage.load();
  }

  async create(project: Project): Promise<void> {
    const storage = await StorageFactory.getStorage();
    await storage.addProject(project);
  }

  async update(id: string, updates: Partial<Project>): Promise<void> {
    const storage = await StorageFactory.getStorage();
    await storage.updateProject(id, updates);
  }

  async delete(id: string): Promise<void> {
    const storage = await StorageFactory.getStorage();
    await storage.removeProject(id);
  }

  async updatePosition(id: string, x: number, y: number): Promise<void> {
    const storage = await StorageFactory.getStorage();
    await storage.setPosition(id, { x, y });
  }

  async saveAll(data: WorkspaceData): Promise<void> {
    const storage = await StorageFactory.getStorage();
    await storage.save(data);
  }
}

export const projectRepository = new ProjectRepository();
