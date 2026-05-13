import { workspaceStorage } from "../storage/storageFactory";
import { Secret } from "@/shared/schema/types";

export class SecretRepository {
  async upsert(projectId: string, secret: Secret, serviceId?: string): Promise<void> {
    await workspaceStorage.upsertSecret(projectId, secret, serviceId);
  }

  async batchUpsert(projectId: string, secrets: Secret[], serviceId?: string): Promise<void> {
    await workspaceStorage.batchUpsertSecrets(projectId, secrets, serviceId);
  }

  async delete(projectId: string, secretKey: string): Promise<void> {
    await workspaceStorage.deleteSecret(projectId, secretKey);
  }
}

export const secretRepository = new SecretRepository();
