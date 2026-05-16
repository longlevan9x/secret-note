import { ProjectPageClient } from "@/client/components/projects/ProjectPageClient";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  return <ProjectPageClient id={id} />;
}
