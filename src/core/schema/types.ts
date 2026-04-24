export type EncryptionMethod = "AES-256-GCM" | "AES-256-CBC" | string;

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
}

export interface ServiceNode {
  id: string;
  name: string;
  provider: string; // e.g., 'Supabase', 'Vercel'
  icon?: string; // Icon slug for Simple Icons
  env: string; // e.g., 'Production', 'Development'
  description?: string;
  secrets: Secret[];
  dependsOn: string[]; // Array of ServiceNode IDs this node depends on
  position?: { x: number; y: number };
}

export interface Project {
  id: string;
  name: string;
  nodes: ServiceNode[];
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface WorkspaceData {
  version: string;
  settings: AppSettings;
  projects: Project[];
}

// Default initial state
export const DEFAULT_WORKSPACE_DATA: WorkspaceData = {
  version: "2.0",
  settings: {
    encryptionMethod: "AES-256-GCM",
    environments: ["Development", "Staging", "Production"],
  },
  projects: [],
};

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
