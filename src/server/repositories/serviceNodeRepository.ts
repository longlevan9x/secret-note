import { workspaceStorage } from "../storage/storageFactory";
import { ServiceNode, Secret } from "@/shared/schema/types";

export class ServiceNodeRepository {
  async create(projectId: string, node: ServiceNode, initialSecrets?: Secret[]): Promise<void> {
    await workspaceStorage.addService(projectId, node, initialSecrets);
  }

  async update(projectId: string, serviceId: string, updates: Partial<ServiceNode>): Promise<void> {
    await workspaceStorage.updateService(projectId, serviceId, updates);
  }

  async delete(projectId: string, serviceId: string): Promise<void> {
    await workspaceStorage.removeService(projectId, serviceId);
  }

  async updatePosition(projectId: string, serviceId: string, x: number, y: number): Promise<void> {
    await workspaceStorage.setPosition(projectId, { x, y }, serviceId);
  }
}

export const serviceNodeRepository = new ServiceNodeRepository();
