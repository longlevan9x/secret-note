import { secretRepository } from "../repositories/secretRepository";
import { Secret } from "@/shared/schema/types";

export class SecretService {
  async upsert(projectId: string, secret: Secret, serviceId?: string): Promise<void> {
    await secretRepository.upsert(projectId, secret, serviceId);
  }

  async batchUpsert(projectId: string, secrets: Secret[], serviceId?: string): Promise<void> {
    await secretRepository.batchUpsert(projectId, secrets, serviceId);
  }

  async remove(projectId: string, secretKey: string): Promise<void> {
    await secretRepository.delete(projectId, secretKey);
  }
}

export const secretService = new SecretService();
