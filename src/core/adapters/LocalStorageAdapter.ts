import { IStorage } from "../interfaces/IStorage";
import { WorkspaceData } from "../schema/types";
import { APP_CONFIG } from "../constants/app";

const STORAGE_KEY = APP_CONFIG.STORAGE_KEYS.WORKSPACE_DATA;

export class LocalStorageAdapter implements IStorage {
  /**
   * Load the workspace data from the browser's local storage.
   */
  async load(): Promise<WorkspaceData | null> {
    if (typeof window === "undefined") {
      // Return null or handle SSR gracefully
      return null;
    }

    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        return null;
      }

      const parsedData = JSON.parse(rawData) as WorkspaceData;
      return parsedData;
    } catch (error) {
      console.error("Failed to load workspace data from LocalStorage:", error);
      return null;
    }
  }

  /**
   * Save the workspace data to the browser's local storage.
   * @param data The workspace data to save
   */
  async save(data: WorkspaceData): Promise<void> {
    if (typeof window === "undefined") {
      throw new Error("Cannot save to LocalStorage on the server-side.");
    }

    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serializedData);
    } catch (error) {
      console.error("Failed to save workspace data to LocalStorage:", error);
      throw error;
    }
  }

  /**
   * Sync implementation for LocalStorage.
   * Currently a no-op since data is always local.
   */
  async sync(): Promise<void> {
    // No-op for local storage, possibly could trigger cross-tab synchronization in the future
    return Promise.resolve();
  }
}
