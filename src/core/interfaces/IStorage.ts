import { WorkspaceData } from "../schema/types";

export interface IStorage {
  /**
   * Load the workspace data from the storage provider.
   * @returns A promise that resolves to the WorkspaceData, or null if it doesn't exist.
   */
  load(): Promise<WorkspaceData | null>;

  /**
   * Save the workspace data to the storage provider.
   * @param data The workspace data to save (already encrypted at the secret values).
   */
  save(data: WorkspaceData): Promise<void>;

  /**
   * Sync data with remote storage, if applicable.
   * For local storage, this might just be a no-op or re-load.
   */
  sync?(): Promise<void>;
}
