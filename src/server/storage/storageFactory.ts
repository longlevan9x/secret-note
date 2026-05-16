import { IStorage } from "@/shared/interfaces/iStorage";
import { serverConfig } from "../config/serverConfig";
import { APP_CONFIG } from "@/shared/constants/app";

export class StorageFactory {
  private static instancePromise: Promise<IStorage> | null = null;

  static async getStorage(): Promise<IStorage> {
    if (!this.instancePromise) {
      this.instancePromise = this.createStorage();
    }

    return this.instancePromise;
  }

  static resetForTests(): void {
    this.instancePromise = null;
  }

  private static async createStorage(): Promise<IStorage> {
    const driverType = serverConfig.storageDriver;

    switch (driverType) {
      case APP_CONFIG.DRIVERS.JSON:
      case APP_CONFIG.DRIVERS.FS: {
        const { JsonStorage } = await import("./drivers/jsonStorage");
        return new JsonStorage();
      }
      case APP_CONFIG.DRIVERS.SQLITE:
      case APP_CONFIG.DRIVERS.POSTGRES:
      case APP_CONFIG.DRIVERS.MYSQL: {
        const { DrizzleStorage } = await import("./drivers/drizzleStorage");
        return new DrizzleStorage();
      }
      case APP_CONFIG.DRIVERS.SUPABASE: {
        const { SupabaseStorage } = await import("./drivers/supabaseStorage");
        return new SupabaseStorage();
      }
      default:
        console.warn(`Storage driver ${driverType} not found, falling back to DrizzleStorage`);
        const { DrizzleStorage } = await import("./drivers/drizzleStorage");
        return new DrizzleStorage();
    }
  }
}
