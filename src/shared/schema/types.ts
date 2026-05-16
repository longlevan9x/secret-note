import { APP_CONFIG } from "@/shared/constants/app";

export type EncryptionMethod = "AES-256-GCM" | "AES-256-CBC" | string;
export type SyncStatus = "idle" | "syncing" | "success" | "error";
export type HealthStatus = "unknown" | "healthy" | "warning" | "critical";

export interface AppSettings {
  encryptionMethod: EncryptionMethod;
  environments: string[];
}

export interface Secret {
  key: string;
  value: string; // The encrypted string
  note?: string;
  lastRotated?: string; // ISO Date string
  ttlDays?: number;
  encryptionVersion?: string;
  encryptionMeta?: {
    algorithm?: EncryptionMethod;
    version?: string;
    keyId?: string;
  };
  health?: {
    status?: HealthStatus;
    issues?: string[];
    checkedAt?: string;
  };
}

export interface ServiceNode {
  id: string;
  name: string;
  provider: string; // e.g., 'Supabase', 'Vercel'
  icon?: string; // Icon slug for Simple Icons
  env: string; // e.g., 'Production', 'Development'
  description?: string;
  secretKeys: string[]; // References to keys in Project.secrets
  dependsOn: string[]; // Array of ServiceNode IDs this node depends on
  position?: { x: number; y: number };
  color?: string; // Hex color code for graph node
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  secrets: Secret[]; // Centralized secrets for the project
  nodes: ServiceNode[];
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface WorkspaceData {
  version: string;
  settings: AppSettings;
  projects: Project[];
  validationHash?: string; // Used to verify master password
  customTemplates?: ServiceTemplate[];
  metadata?: WorkspaceMetadata;
}

export interface SecretTemplate {
  key: string;
  description?: string;
  isSensitive?: boolean;
}

export interface ServiceTemplate {
  providerId: string;
  name: string;
  icon?: string; // Optional icon class or URL
  secretTemplates: SecretTemplate[];
}

export type StorageType = "local" | "github" | "supabase";

export interface GitHubConfig {
  token: string;
  repo: string;
  path: string;
  branch: string;
}

export interface SupabaseConfig {
  url: string;
  key: string;
  workspaceId: string;
}

export interface VaultConfig {
  id: string;
  name: string;
  type: StorageType;
  github?: GitHubConfig;
  supabase?: SupabaseConfig;
  lastAccessedAt?: string;
}

export type StorageConfig = VaultConfig;


export interface StorageMetadata {
  activeType: StorageType;
  lastSavedAt?: string;
  lastLoadedAt?: string;
}

export interface SyncMetadata {
  status: SyncStatus;
  lastSyncedAt?: string;
  lastError?: string;
}

export interface WorkspaceHealthMetadata {
  status: HealthStatus;
  issues: string[];
  checkedAt?: string;
}

export interface WorkspaceMetadata {
  storage: StorageMetadata;
  sync: SyncMetadata;
  health: WorkspaceHealthMetadata;
}

export const DEFAULT_WORKSPACE_METADATA: WorkspaceMetadata = {
  storage: {
    activeType: "local",
  },
  sync: {
    status: "idle",
  },
  health: {
    status: "unknown",
    issues: [],
  },
};

// Default initial state
export const DEFAULT_WORKSPACE_DATA: WorkspaceData = {
  version: APP_CONFIG.VERSION,
  settings: {
    encryptionMethod: APP_CONFIG.ENCRYPTION_METHOD,
    environments: APP_CONFIG.DEFAULT_ENVIRONMENTS,
  },
  projects: [],
  customTemplates: [],
  metadata: DEFAULT_WORKSPACE_METADATA,
};

export enum WorkspaceActionType {
  ADD_PROJECT = "ADD_PROJECT",
  UPDATE_PROJECT = "UPDATE_PROJECT",
  REMOVE_PROJECT = "REMOVE_PROJECT",
  ADD_SERVICE = "ADD_SERVICE",
  UPDATE_SERVICE = "UPDATE_SERVICE",
  REMOVE_SERVICE = "REMOVE_SERVICE",
  UPSERT_SECRET = "UPSERT_SECRET",
  BATCH_UPSERT_SECRET = "BATCH_UPSERT_SECRET",
  DELETE_SECRET = "DELETE_SECRET",
  LINK_SECRET = "LINK_SECRET",
  UNLINK_SECRET = "UNLINK_SECRET",
  UPDATE_SETTINGS = "UPDATE_SETTINGS",
  SET_POSITION = "SET_POSITION",
}

export interface WorkspaceAction {
  type: WorkspaceActionType;
  payload: unknown;
}
