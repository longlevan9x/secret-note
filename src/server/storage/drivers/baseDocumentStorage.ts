import { IStorage } from "@/shared/interfaces/iStorage";
import { WorkspaceData, Project, ServiceNode, Secret } from "@/shared/schema/types";

/**
 * Base class for Storage Drivers working with "Document" style data (whole object).
 * Helps avoid rewriting map/filter logic for each driver.
 */
export abstract class BaseDocumentStorage implements IStorage {
  // Abstract methods that sub-drivers must implement
  abstract loadRaw(): Promise<WorkspaceData | null>;
  abstract saveRaw(data: WorkspaceData): Promise<void>;

  /**
   * Implements IStorage methods by manipulating the Object
   * and then saving it via saveRaw.
   */
  async load(): Promise<WorkspaceData | null> {
    return await this.loadRaw();
  }

  async save(data: WorkspaceData): Promise<void> {
    await this.saveRaw(data);
  }

  async addProject(project: Project): Promise<void> {
    const data = await this.load();
    if (!data) return;
    data.projects.push(project);
    await this.save(data);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const data = await this.load();
    if (!data) return;
    data.projects = data.projects.map(p => p.id === id ? { ...p, ...updates } : p);
    await this.save(data);
  }

  async removeProject(id: string): Promise<void> {
    const data = await this.load();
    if (!data) return;
    data.projects = data.projects.filter(p => p.id !== id);
    await this.save(data);
  }

  async addService(projectId: string, node: ServiceNode, initialSecrets?: Secret[]): Promise<void> {
    const data = await this.load();
    if (!data) return;
    data.projects = data.projects.map(p => {
      if (p.id !== projectId) return p;
      const nextSecrets = [...(p.secrets || [])];
      if (initialSecrets) {
        initialSecrets.forEach(s => {
          if (!nextSecrets.some(es => es.key === s.key)) nextSecrets.push(s);
        });
      }
      return { ...p, secrets: nextSecrets, nodes: [...p.nodes, node] };
    });
    await this.save(data);
  }

  async updateService(projectId: string, serviceId: string, updates: Partial<ServiceNode>): Promise<void> {
    const data = await this.load();
    if (!data) return;
    data.projects = data.projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        nodes: p.nodes.map(n => n.id === serviceId ? { ...n, ...updates } : n)
      };
    });
    await this.save(data);
  }

  async removeService(projectId: string, serviceId: string): Promise<void> {
    const data = await this.load();
    if (!data) return;
    data.projects = data.projects.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, nodes: p.nodes.filter(n => n.id !== serviceId) };
    });
    await this.save(data);
  }

  async upsertSecret(projectId: string, secret: Secret, serviceId?: string): Promise<void> {
    const data = await this.load();
    if (!data) return;
    data.projects = data.projects.map(p => {
      if (p.id !== projectId) return p;
      const secrets = [...(p.secrets || [])];
      const index = secrets.findIndex(s => s.key === secret.key);
      if (index >= 0) secrets[index] = { ...secrets[index], ...secret };
      else secrets.push(secret);

      const nodes = p.nodes.map(n => {
        if (serviceId && n.id === serviceId) {
          const secretKeys = [...(n.secretKeys || [])];
          if (!secretKeys.includes(secret.key)) secretKeys.push(secret.key);
          return { ...n, secretKeys };
        }
        return n;
      });
      return { ...p, secrets, nodes };
    });
    await this.save(data);
  }

  async batchUpsertSecrets(projectId: string, newSecrets: Secret[], serviceId?: string): Promise<void> {
    const data = await this.load();
    if (!data) return;
    data.projects = data.projects.map(p => {
      if (p.id !== projectId) return p;
      const secrets = [...(p.secrets || [])];
      newSecrets.forEach(ns => {
        const index = secrets.findIndex(s => s.key === ns.key);
        if (index >= 0) secrets[index] = { ...secrets[index], ...ns };
        else secrets.push(ns);
      });
      const nodes = p.nodes.map(n => {
        if (serviceId && n.id === serviceId) {
          const secretKeys = [...(n.secretKeys || [])];
          newSecrets.forEach(ns => {
            if (!secretKeys.includes(ns.key)) secretKeys.push(ns.key);
          });
          return { ...n, secretKeys };
        }
        return n;
      });
      return { ...p, secrets, nodes };
    });
    await this.save(data);
  }

  async deleteSecret(projectId: string, secretKey: string): Promise<void> {
    const data = await this.load();
    if (!data) return;
    data.projects = data.projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        secrets: (p.secrets || []).filter(s => s.key !== secretKey),
        nodes: p.nodes.map(n => ({
          ...n,
          secretKeys: (n.secretKeys || []).filter(k => k !== secretKey)
        }))
      };
    });
    await this.save(data);
  }

  async setPosition(projectId: string, position: { x: number; y: number }, serviceId?: string): Promise<void> {
    const data = await this.load();
    if (!data) return;
    data.projects = data.projects.map(p => {
      if (p.id !== projectId) return p;
      if (!serviceId) return { ...p, position };
      return {
        ...p,
        nodes: p.nodes.map(n => n.id === serviceId ? { ...n, position } : n)
      };
    });
    await this.save(data);
  }
}
