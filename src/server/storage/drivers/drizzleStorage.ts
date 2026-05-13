import { eq, and } from "drizzle-orm";
import { IStorage } from "@/shared/interfaces/iStorage";
import { WorkspaceData, Project, ServiceNode, Secret } from "@/shared/schema/types";
import * as schema from "../schema";
import { db as defaultDb } from "../dbConnection";
import { APP_CONFIG } from "@/shared/constants/app";

export class DrizzleStorage implements IStorage {
  private db;

  constructor(db = defaultDb) {
    this.db = db;
  }

  async load(): Promise<WorkspaceData | null> {
    const dbProjects = await this.db.query.projects.findMany();
    const dbSettings = await this.db.query.settings.findFirst({ 
      where: eq(schema.settings.key, APP_CONFIG.STORAGE_KEYS.APP_SETTINGS) 
    });

    const projects: Project[] = await Promise.all(dbProjects.map(async (p) => {
      const pServices = await this.db.query.services.findMany({ where: eq(schema.services.projectId, p.id) });
      const pSecrets = await this.db.query.secrets.findMany({ where: eq(schema.secrets.projectId, p.id) });

      const nodes: ServiceNode[] = await Promise.all(pServices.map(async (s) => {
        const sSecrets = await this.db.query.serviceSecrets.findMany({ where: eq(schema.serviceSecrets.serviceId, s.id) });
        const sDeps = await this.db.query.serviceDependencies.findMany({ where: eq(schema.serviceDependencies.serviceId, s.id) });

        return {
          id: s.id,
          name: s.name,
          provider: s.provider as any,
          icon: s.icon as any,
          env: s.env as any,
          description: s.description || "",
          position: { x: s.posX || 0, y: s.posY || 0 },
          secretKeys: sSecrets.map(ss => ss.secretKey),
          dependsOn: sDeps.map(sd => sd.dependencyId),
        };
      }));

      return {
        id: p.id,
        name: p.name,
        position: { x: p.posX || 0, y: p.posY || 0 },
        size: { width: p.width || 800, height: p.height || 600 },
        nodes,
        secrets: pSecrets.map(sec => ({
          key: sec.key,
          value: sec.value,
          note: sec.note || undefined,
          lastRotated: sec.lastRotated || undefined,
        })),
      };
    }));

    return {
      version: APP_CONFIG.VERSION,
      settings: dbSettings ? JSON.parse(dbSettings.value) : { 
        encryptionMethod: APP_CONFIG.ENCRYPTION_METHOD, 
        environments: APP_CONFIG.DEFAULT_ENVIRONMENTS 
      },
      projects,
      customTemplates: [],
    };
  }

  async save(data: WorkspaceData): Promise<void> {
    // Use common transaction for all drivers (SQLite/PG/MySQL)
    await this.db.transaction(async (tx) => {
      await tx.delete(schema.projects);
      await tx.delete(schema.settings);
      
      await tx.insert(schema.settings).values({ key: APP_CONFIG.STORAGE_KEYS.APP_SETTINGS, value: JSON.stringify(data.settings) });

      for (const p of data.projects) {
        await tx.insert(schema.projects).values({
          id: p.id,
          name: p.name,
          posX: p.position?.x ?? 0,
          posY: p.position?.y ?? 0,
          width: p.size?.width ?? 800,
          height: p.size?.height ?? 600,
        });

        if (p.secrets) {
          const uniqueSecrets = new Map();
          p.secrets.forEach(s => uniqueSecrets.set(s.key, s));

          for (const s of uniqueSecrets.values()) {
            await tx.insert(schema.secrets).values({
              projectId: p.id,
              key: s.key,
              value: s.value,
              note: s.note,
              lastRotated: s.lastRotated,
            });
          }
        }

        for (const n of p.nodes) {
          await tx.insert(schema.services).values({
            id: n.id,
            projectId: p.id,
            name: n.name,
            provider: n.provider,
            icon: n.icon,
            env: n.env,
            description: n.description,
            posX: n.position?.x ?? 50,
            posY: n.position?.y ?? 50,
          });

          if (n.secretKeys) {
            for (const sk of n.secretKeys) {
              await tx.insert(schema.serviceSecrets).values({
                serviceId: n.id,
                secretKey: sk,
                projectId: p.id,
              });
            }
          }

          if (n.dependsOn) {
            for (const depId of n.dependsOn) {
              await tx.insert(schema.serviceDependencies).values({
                serviceId: n.id,
                dependencyId: depId,
              });
            }
          }
        }
      }
    });
  }

  async addProject(project: Project): Promise<void> {
    await this.db.insert(schema.projects).values({
      id: project.id,
      name: project.name,
      posX: project.position?.x ?? 0,
      posY: project.position?.y ?? 0,
    });
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    await this.db.update(schema.projects)
      .set({
        name: updates.name,
        posX: updates.position?.x,
        posY: updates.position?.y,
        width: updates.size?.width,
        height: updates.size?.height,
      })
      .where(eq(schema.projects.id, id));
  }

  async removeProject(id: string): Promise<void> {
    await this.db.delete(schema.projects).where(eq(schema.projects.id, id));
  }

  async addService(projectId: string, node: ServiceNode, initialSecrets?: Secret[]): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx.insert(schema.services).values({
        id: node.id,
        projectId,
        name: node.name,
        provider: node.provider,
        icon: node.icon,
        env: node.env,
        description: node.description,
        posX: node.position?.x ?? 50,
        posY: node.position?.y ?? 50,
      });

      if (initialSecrets) {
        for (const s of initialSecrets) {
          await tx.insert(schema.secrets).values({
            projectId,
            key: s.key,
            value: s.value,
            note: s.note,
            lastRotated: s.lastRotated,
          }).onConflictDoNothing();
          
          await tx.insert(schema.serviceSecrets).values({
            serviceId: node.id,
            secretKey: s.key,
            projectId,
          });
        }
      }
    });
  }

  async updateService(projectId: string, serviceId: string, updates: Partial<ServiceNode>): Promise<void> {
    await this.db.update(schema.services)
      .set({
        name: updates.name,
        provider: updates.provider,
        icon: updates.icon,
        env: updates.env,
        description: updates.description,
        posX: updates.position?.x,
        posY: updates.position?.y,
      })
      .where(eq(schema.services.id, serviceId));
  }

  async removeService(projectId: string, serviceId: string): Promise<void> {
    await this.db.delete(schema.services).where(eq(schema.services.id, serviceId));
  }

  async upsertSecret(projectId: string, secret: Secret, serviceId?: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx.insert(schema.secrets).values({
        projectId,
        key: secret.key,
        value: secret.value,
        note: secret.note,
        lastRotated: secret.lastRotated,
      }).onConflictDoUpdate({
        target: [schema.secrets.projectId, schema.secrets.key],
        set: { value: secret.value, note: secret.note, lastRotated: secret.lastRotated }
      });

      if (serviceId) {
        await tx.insert(schema.serviceSecrets).values({
          serviceId,
          secretKey: secret.key,
          projectId,
        }).onConflictDoNothing();
      }
    });
  }

  async batchUpsertSecrets(projectId: string, secrets: Secret[], serviceId?: string): Promise<void> {
    for (const s of secrets) {
      await this.upsertSecret(projectId, s, serviceId);
    }
  }

  async deleteSecret(projectId: string, secretKey: string): Promise<void> {
    await this.db.delete(schema.secrets)
      .where(and(eq(schema.secrets.projectId, projectId), eq(schema.secrets.key, secretKey)));
  }

  async setPosition(projectId: string, position: { x: number; y: number }, serviceId?: string): Promise<void> {
    if (serviceId) {
      await this.db.update(schema.services)
        .set({ posX: position.x, posY: position.y })
        .where(eq(schema.services.id, serviceId));
    } else {
      await this.db.update(schema.projects)
        .set({ posX: position.x, posY: position.y })
        .where(eq(schema.projects.id, projectId));
    }
  }
}
