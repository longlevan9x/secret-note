import { IStorage } from "@/shared/interfaces/iStorage";
import { WorkspaceData, Project, ServiceNode, Secret } from "@/shared/schema/types";
import { APP_CONFIG } from "@/shared/constants/app";

export class ApiAdapter implements IStorage {
  private getHeaders() {
    const pwd = typeof window !== "undefined" ? sessionStorage.getItem(APP_CONFIG.STORAGE_KEYS.MASTER_PASSWORD) : null;
    return {
      "Content-Type": "application/json",
      ...(pwd ? { "Authorization": `Bearer ${pwd}` } : {}),
    };
  }

  async load(): Promise<WorkspaceData | null> {
    const res = await fetch(`${APP_CONFIG.API_ENDPOINT}/projects`, { headers: this.getHeaders() });
    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Failed to load data from server");
    return res.json();
  }

  async save(data: WorkspaceData): Promise<void> {
    const res = await fetch(`${APP_CONFIG.API_ENDPOINT}/projects`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Failed to save data to server");
  }

  /**
   * Project Operations
   */
  async addProject(project: Project): Promise<void> {
    const res = await fetch(`${APP_CONFIG.API_ENDPOINT}/projects`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error("Failed to add project");
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const res = await fetch(`${APP_CONFIG.API_ENDPOINT}/projects/${id}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update project");
  }

  async removeProject(id: string): Promise<void> {
    const res = await fetch(`${APP_CONFIG.API_ENDPOINT}/projects/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to remove project");
  }

  /**
   * Service Operations
   */
  async addService(projectId: string, node: ServiceNode, initialSecrets?: Secret[]): Promise<void> {
    const res = await fetch(`${APP_CONFIG.API_ENDPOINT}/projects/${projectId}/services`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ node, initialSecrets }),
    });
    if (!res.ok) throw new Error("Failed to add service");
  }

  async updateService(projectId: string, serviceId: string, updates: Partial<ServiceNode>): Promise<void> {
    const res = await fetch(`${APP_CONFIG.API_ENDPOINT}/projects/${projectId}/services/${serviceId}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update service");
  }

  async removeService(projectId: string, serviceId: string): Promise<void> {
    const res = await fetch(`${APP_CONFIG.API_ENDPOINT}/projects/${projectId}/services/${serviceId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to remove service");
  }

  /**
   * Secret Operations
   */
  async upsertSecret(projectId: string, secret: Secret, serviceId?: string): Promise<void> {
    const res = await fetch(`${APP_CONFIG.API_ENDPOINT}/projects/${projectId}/secrets`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ secret, serviceId }),
    });
    if (!res.ok) throw new Error("Failed to upsert secret");
  }

  async batchUpsertSecrets(projectId: string, secrets: Secret[], serviceId?: string): Promise<void> {
    const res = await fetch(`${APP_CONFIG.API_ENDPOINT}/projects/${projectId}/secrets`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ secrets, serviceId }),
    });
    if (!res.ok) throw new Error("Failed to batch upsert secrets");
  }

  async deleteSecret(projectId: string, secretKey: string): Promise<void> {
    const res = await fetch(`${APP_CONFIG.API_ENDPOINT}/projects/${projectId}/secrets/${secretKey}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete secret");
  }

  /**
   * Position Updates
   */
  async setPosition(projectId: string, position: { x: number; y: number }, serviceId?: string): Promise<void> {
    const url = serviceId 
      ? `${APP_CONFIG.API_ENDPOINT}/projects/${projectId}/services/${serviceId}`
      : `${APP_CONFIG.API_ENDPOINT}/projects/${projectId}`;
    
    const res = await fetch(url, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify({ position }),
    });
    if (!res.ok) throw new Error("Failed to set position");
  }

  async sync(): Promise<void> {
    return Promise.resolve();
  }
}
