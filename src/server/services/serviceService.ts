import { serviceNodeRepository } from "../repositories/serviceNodeRepository";
import { ServiceNode, Secret } from "@/shared/schema/types";

export class ServiceService {
  async add(projectId: string, node: ServiceNode, initialSecrets?: Secret[]): Promise<void> {
    await serviceNodeRepository.create(projectId, node, initialSecrets);
  }

  async update(projectId: string, serviceId: string, updates: Partial<ServiceNode>): Promise<void> {
    await serviceNodeRepository.update(projectId, serviceId, updates);
  }

  async remove(projectId: string, serviceId: string): Promise<void> {
    await serviceNodeRepository.delete(projectId, serviceId);
  }

  async setPosition(projectId: string, serviceId: string, position: { x: number; y: number }): Promise<void> {
    await serviceNodeRepository.updatePosition(projectId, serviceId, position.x, position.y);
  }
}

export const serviceService = new ServiceService();
