import { WorkspaceData } from "@/shared/schema/types";
import { storage } from "@/server/database/db";
import { APP_CONFIG } from "@/shared/constants/app";
import { encryptData, decryptData } from "@/shared/security/crypto";
import { BaseDocumentStorage } from "./baseDocumentStorage";

const VAULT_KEY = APP_CONFIG.VAULT_KEY;

export class JsonStorage extends BaseDocumentStorage {
  private encryptionKey = process.env.ENCRYPTION_KEY;

  /**
   * Only need to implement how to read raw data
   */
  async loadRaw(): Promise<WorkspaceData | null> {
    const raw = await storage.getItem(VAULT_KEY);
    if (!raw) return null;

    let data: WorkspaceData;
    if (typeof raw === "string") {
      data = JSON.parse(raw);
    } else {
      data = raw as WorkspaceData;
    }

    return this.transformSecrets(data, 'decrypt');
  }

  /**
   * Only need to implement how to read raw data
   */
  async saveRaw(data: WorkspaceData): Promise<void> {
    const dataToSave = await this.transformSecrets(data, 'encrypt');
    await storage.setItem(VAULT_KEY, dataToSave);
  }

  /**
   * Reuse logic for encrypting/decrypting secrets
   */
  private async transformSecrets(data: WorkspaceData, mode: 'encrypt' | 'decrypt'): Promise<WorkspaceData> {
    if (!this.encryptionKey) return data;

    const nextData = { ...data };
    nextData.projects = nextData.projects.map(project => {
      const nextProject = { ...project };
      if (nextProject.secrets) {
        nextProject.secrets = nextProject.secrets.map(secret => ({
          ...secret,
          value: mode === 'encrypt' 
            ? encryptData(secret.value, this.encryptionKey!) 
            : decryptData(secret.value, this.encryptionKey!)
        }));
      }
      return nextProject;
    });

    return nextData;
  }
}
