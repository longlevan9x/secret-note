import { StorageFactory } from "../storage/storageFactory";
import { ServiceNode, Secret } from "@/shared/schema/types";

export class ServiceNodeRepository {
  async create(projectId: string, node: ServiceNode, initialSecrets?: Secret[]): Promise<void> {
    const storage = await StorageFactory.getStorage();
    await storage.addService(projectId, node, initialSecrets);
  }

  async update(projectId: string, serviceId: string, updates: Partial<ServiceNode>): Promise<void> {
    const storage = await StorageFactory.getStorage();
    await storage.updateService(projectId, serviceId, updates);
  }

  async delete(projectId: string, serviceId: string): Promise<void> {
    const storage = await StorageFactory.getStorage();
    await storage.removeService(projectId, serviceId);
  }

  async updatePosition(projectId: string, serviceId: string, x: number, y: number): Promise<void> {
    const storage = await StorageFactory.getStorage();
    await storage.setPosition(projectId, { x, y }, serviceId);
  }
}

export const serviceNodeRepository = new ServiceNodeRepository();
