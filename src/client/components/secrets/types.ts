import type { Project, Secret, ServiceNode } from "@/shared/schema/types";

export type SecretWithUsage = Secret & {
  projectId: string;
  projectName: string;
  linkedServices: ServiceNode[];
};

export type ServiceQuickViewContext = Project | null;
