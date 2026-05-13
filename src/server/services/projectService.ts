import { projectRepository } from "../repositories/projectRepository";
import { Project, WorkspaceData } from "@/shared/schema/types";

export class ProjectService {
  async getAll(): Promise<WorkspaceData | null> {
    return await projectRepository.findAll();
  }

  async add(project: Project): Promise<void> {
    await projectRepository.create(project);
  }

  async update(id: string, updates: Partial<Project>): Promise<void> {
    await projectRepository.update(id, updates);
  }

  async remove(id: string): Promise<void> {
    await projectRepository.delete(id);
  }

  async setPosition(id: string, position: { x: number; y: number }): Promise<void> {
    await projectRepository.updatePosition(id, position.x, position.y);
  }

  async saveAll(data: WorkspaceData): Promise<void> {
    await projectRepository.saveAll(data);
  }
}

export const projectService = new ProjectService();
