import { StorageFactory } from "../storage/storageFactory";
import { Secret } from "@/shared/schema/types";

export class SecretRepository {
  async upsert(projectId: string, secret: Secret, serviceId?: string): Promise<void> {
    const storage = await StorageFactory.getStorage();
    await storage.upsertSecret(projectId, secret, serviceId);
  }

  async batchUpsert(projectId: string, secrets: Secret[], serviceId?: string): Promise<void> {
    const storage = await StorageFactory.getStorage();
    await storage.batchUpsertSecrets(projectId, secrets, serviceId);
  }

  async delete(projectId: string, secretKey: string): Promise<void> {
    const storage = await StorageFactory.getStorage();
    await storage.deleteSecret(projectId, secretKey);
  }
}

export const secretRepository = new SecretRepository();
