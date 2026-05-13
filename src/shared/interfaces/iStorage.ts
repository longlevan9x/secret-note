import { WorkspaceData, Project, ServiceNode, Secret } from "../schema/types";

export interface IStorage {
  /**
   * Load the workspace data from the storage provider.
   */
  load(): Promise<WorkspaceData | null>;

  /**
   * Save the whole workspace data (for migration or full updates).
   */
  save(data: WorkspaceData): Promise<void>;

  /**
   * Granular Operations
   */
  addProject(project: Project): Promise<void>;
  updateProject(id: string, updates: Partial<Project>): Promise<void>;
  removeProject(id: string): Promise<void>;

  addService(projectId: string, node: ServiceNode, initialSecrets?: Secret[]): Promise<void>;
  updateService(projectId: string, serviceId: string, updates: Partial<ServiceNode>): Promise<void>;
  removeService(projectId: string, serviceId: string): Promise<void>;

  upsertSecret(projectId: string, secret: Secret, serviceId?: string): Promise<void>;
  batchUpsertSecrets(projectId: string, secrets: Secret[], serviceId?: string): Promise<void>;
  deleteSecret(projectId: string, secretKey: string): Promise<void>;

  setPosition(projectId: string, position: { x: number; y: number }, serviceId?: string): Promise<void>;

  /**
   * Sync data with remote storage, if applicable.
   */
  sync?(): Promise<void>;
}
