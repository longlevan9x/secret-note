import { IStorage } from "@/shared/interfaces/iStorage";
import { JsonStorage } from "./drivers/jsonStorage";
import { SupabaseStorage } from "./drivers/supabaseStorage";
import { DrizzleStorage } from "./drivers/drizzleStorage";
import { serverConfig } from "../config/serverConfig";
import { APP_CONFIG } from "@/shared/constants/app";

export class StorageFactory {
  private static instance: IStorage | null = null;

  static getStorage(): IStorage {
    if (this.instance) return this.instance;

    const driverType = serverConfig.storageDriver;

    switch (driverType) {
      case APP_CONFIG.DRIVERS.JSON:
      case APP_CONFIG.DRIVERS.FS:
        this.instance = new JsonStorage();
        break;
      case APP_CONFIG.DRIVERS.SQLITE:
      case APP_CONFIG.DRIVERS.POSTGRES:
      case APP_CONFIG.DRIVERS.MYSQL:
        this.instance = new DrizzleStorage();
        break;
      case APP_CONFIG.DRIVERS.SUPABASE:
        this.instance = new SupabaseStorage();
        break;
      default:
        console.warn(`Storage driver ${driverType} not found, falling back to DrizzleStorage`);
        this.instance = new DrizzleStorage();
    }

    return this.instance;
  }
}

export const workspaceStorage = StorageFactory.getStorage();
