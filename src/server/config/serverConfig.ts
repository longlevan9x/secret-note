import { APP_CONFIG } from "@/shared/constants/app";
import fs from "fs";
import path from "path";

class ServerConfig {
  private fileConfig: Record<string, unknown> = {};

  constructor() {
    this.loadConfigFile();
  }

  private loadConfigFile() {
    try {
      const configPath = path.join(process.cwd(), "server.config.json");
      console.log(`[Config] Checking config at: ${configPath}`);
      
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, "utf-8");
        this.fileConfig = JSON.parse(content) as Record<string, unknown>;
        console.log("[Config] Successfully loaded server.config.json", this.fileConfig);
      } else {
        console.log("[Config] server.config.json not found, using ENV/Defaults");
      }
    } catch (error) {
      console.error("[Config] Error loading server.config.json:", error);
    }
  }

  /**
   * Helper to get values with priority: ENV > FILE > DEFAULT
   */
  private getValue<T>(key: string, defaultValue: T): T {
    // 1. Check ENV
    if (process.env[key] !== undefined) return process.env[key] as T;
    
    // 2. Check File Config
    if (this.fileConfig[key] !== undefined) return this.fileConfig[key] as T;
    
    // 3. Return Default
    return defaultValue;
  }

  /**
   * System login password
   */
  get loginPassword(): string {
    return this.getValue("LOGIN_PASSWORD", this.getValue("MASTER_PASSWORD", ""));
  }

  /**
   * Data encryption key
   */
  get encryptionKey(): string {
    const key = this.getValue("ENCRYPTION_KEY", null);
    if (!key && process.env.NODE_ENV === 'production') {
      console.warn("WARNING: ENCRYPTION_KEY is missing in production environment!");
    }
    return key || "default_local_dev_key_change_me";
  }

  /**
   * Primary storage driver
   */
  get storageDriver(): string {
    return this.getValue("STORAGE_DRIVER", APP_CONFIG.DEFAULTS.STORAGE_DRIVER);
  }

  /**
   * Database type (for Drizzle) - Automatically derived from storageDriver if it's a DB type
   */
  get databaseType(): string {
    const driver = this.storageDriver;
    const dbDrivers = [APP_CONFIG.DRIVERS.SQLITE, APP_CONFIG.DRIVERS.POSTGRES, APP_CONFIG.DRIVERS.MYSQL];
    
    // If the current driver is a DB type, prioritize it as databaseType
    if (dbDrivers.includes(driver)) return driver;
    
    // Fallback for cases using JSON but still wanting to config DB (rare)
    return this.getValue("DATABASE_TYPE", APP_CONFIG.DRIVERS.SQLITE);
  }

  /**
   * Database connection URL or SQLite file path
   */
  get databaseUrl(): string {
    return this.getValue("DATABASE_URL", "workspace.db");
  }

  /**
   * Github configuration (if using Github driver)
   */
  get github() {
    return {
      repo: this.getValue("GITHUB_REPO", ""),
      branch: this.getValue("GITHUB_BRANCH", APP_CONFIG.DEFAULTS.GITHUB_BRANCH),
      token: this.getValue("GITHUB_TOKEN", ""),
    };
  }

  /**
   * Validates if the basic configuration is sufficient
   */
  validate() {
    const missing = [];
    if (!this.loginPassword) missing.push("MASTER_PASSWORD/LOGIN_PASSWORD");
    
    if (missing.length > 0) {
      console.error(`CRITICAL CONFIG MISSING: ${missing.join(", ")}`);
    }
    return missing.length === 0;
  }
}

export const serverConfig = new ServerConfig();
