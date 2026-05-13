"use client";

import { useCallback, useMemo, useEffect, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  addEdge,
  Connection,
  Panel,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/client/context/WorkspaceContext";
import { ServiceGraphNode } from "./ServiceGraphNode";
import { ProjectNode } from "./ProjectNode";
import ButtonEdge from "./ButtonEdge";
import { GRAPH_CONFIG, NODE_TYPES } from "@/shared/constants/graph";
import { 
  Maximize, 
  LayoutDashboard, 
  Plus, 
  RotateCcw,
  MousePointer2,
  FolderTree,
  Share2,
} from "lucide-react";
import { Button, buttonVariants, Select, SelectItem } from "@/client/components/ui";
import { cn } from "@/client/utils/utils";
import { AddServiceDialog } from "@/client/components/services/AddServiceDialog";
import type { ServiceNode, Secret } from "@/shared/schema/types";


const nodeTypes = {
  [NODE_TYPES.SERVICE_NODE]: ServiceGraphNode,
  [NODE_TYPES.PROJECT_GROUP]: ProjectNode,
};

const edgeTypes = {
  buttonEdge: ButtonEdge,
};

const PADDING = 40;

export function DependencyGraph() {
  const {
    data,
    addService,
    updateService,
    setProjectPosition,
    setProjectSize,
    setServicePosition,
  } = useWorkspace();
  const router = useRouter();
  const { fitView } = useReactFlow();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const resolvedActiveProjectId =
    activeProjectId && data?.projects.some((project) => project.id === activeProjectId)
      ? activeProjectId
      : data?.projects[0]?.id ?? null;

  const serviceProjectMap = useMemo(() => {
    const map = new Map<string, string>();
    data?.projects.forEach((project) => {
      project.nodes.forEach((service) => {
        map.set(service.id, project.id);
      });
    });
    return map;
  }, [data]);

  const handleDeleteEdge = useCallback(
    (_edgeId: string, sourceId: string, targetId: string) => {
      const projectId = serviceProjectMap.get(targetId);
      if (!projectId) return;

      void updateService(projectId, targetId, (node) => ({
        ...node,
        dependsOn: node.dependsOn.filter((id) => id !== sourceId),
      }));
    },
    [serviceProjectMap, updateService]
  );

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (!data) return { initialNodes: nodes, initialEdges: edges };

    let currentY = 0;
    
    
    // Create a map for quick lookup
    const allServiceIds = new Set(data.projects.flatMap(p => p.nodes.map(n => n.id)));

    data.projects.forEach((project) => {
      const serviceCount = project.nodes.length;
      if (serviceCount === 0) return;

      const groupWidth = project.size?.width || (serviceCount * GRAPH_CONFIG.X_OFFSET + PADDING * 2);
      const groupHeight = project.size?.height || (GRAPH_CONFIG.NODE_HEIGHT + PADDING * 2);
      const groupId = `group-${project.id}`;

      // Project Container Node
      nodes.push({
        id: groupId,
        type: NODE_TYPES.PROJECT_GROUP,
        position: project.position || { x: 0, y: currentY },
        style: { width: groupWidth, height: groupHeight },
        data: { 
          label: project.name,
          description: project.description,
          onResizeEnd: (width: number, height: number) => {
            void setProjectSize(project.id, { width, height });
          }
        },
        draggable: true,
      });

      project.nodes.forEach((service, index) => {
        nodes.push({
          id: service.id,
          type: NODE_TYPES.SERVICE_NODE,
          parentId: groupId,
          position: service.position || { 
            x: PADDING + index * GRAPH_CONFIG.X_OFFSET, 
            y: PADDING 
          },
          extent: 'parent',
          data: { 
            label: service.name, 
            icon: service.icon, 
            provider: service.provider,
            env: service.env,
            project: project.name,
            color: service.color,
          },
        });

        // Edges
        service.dependsOn.forEach((depId) => {
          // Only add edge if the source node exists
          if (allServiceIds.has(depId)) {
            edges.push({
              id: `e-${depId}-${service.id}`,
              source: depId,
              target: service.id,
              type: "buttonEdge",
              data: {
                onDeleteEdge: handleDeleteEdge,
              },
              animated: true,
              style: { stroke: GRAPH_CONFIG.EDGE_COLOR, strokeWidth: GRAPH_CONFIG.EDGE_STROKE_WIDTH },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: GRAPH_CONFIG.EDGE_COLOR,
              },
            });
          }
        });
      });

      if (!project.position) {
        currentY += groupHeight + 50; // Add some gap between projects
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [data, handleDeleteEdge, setProjectSize]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent | TouchEvent, node: Node) => {
      if (!data) return;

      data.projects.forEach((project) => {
        // If it's a project container
        if (`group-${project.id}` === node.id) {
          void setProjectPosition(project.id, node.position);
          return;
        }
        
        // If it's a service node
        if (project.nodes.some((service) => service.id === node.id)) {
          void setServicePosition(project.id, node.id, node.position);
        }
      });
    },
    [data, setProjectPosition, setServicePosition]
  );


  const handleResetLayout = useCallback(() => {
    if (!data) return;

    let currentY = 0;

    const resetProjects = data.projects.map((project) => {
      const groupHeight = 300; // Default height for reset
      
      const updatedProject = {
        ...project,
        position: { x: 100, y: currentY },
        nodes: project.nodes.map((node, index) => ({
          ...node,
          position: { 
            x: 50 + index * 220, 
            y: 50 
          }
        }))
      };

      currentY += groupHeight + 100;
      return updatedProject;
    });

    void Promise.all(
      resetProjects.flatMap((project) => [
        setProjectPosition(project.id, project.position!),
        ...project.nodes.map((node) => setServicePosition(project.id, node.id, node.position!)),
      ])
    );
    
    setTimeout(() => {
      fitView({ duration: 800 });
    }, 200);
  }, [data, fitView, setProjectPosition, setServicePosition]);

  const handleAddService = useCallback((serviceData: Omit<ServiceNode, "id">, initialSecrets?: Secret[]) => {
    if (!data || !resolvedActiveProjectId) return;
    
    const project = data.projects.find(p => p.id === resolvedActiveProjectId);
    if (!project) return;

    // Calculate a safe position for the new service so it doesn't overlap
    const serviceCount = project.nodes.length;
    const newPosition = { 
      x: PADDING + serviceCount * GRAPH_CONFIG.X_OFFSET, 
      y: PADDING 
    };

    void addService(resolvedActiveProjectId, {
      ...serviceData,
      position: newPosition,
    }, initialSecrets);
  }, [addService, data, resolvedActiveProjectId]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!data || !params.source || !params.target) return;

      const sourceId = params.source;
      const targetId = params.target;

      const projectId = serviceProjectMap.get(targetId);
      if (projectId) {
        void updateService(projectId, targetId, (node) => ({
          ...node,
          dependsOn: node.dependsOn.includes(sourceId)
            ? node.dependsOn
            : [...node.dependsOn, sourceId],
        }));
      }
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "buttonEdge",
            data: {
              onDeleteEdge: handleDeleteEdge,
            },
          },
          eds
        )
      );
    },
    [data, handleDeleteEdge, serviceProjectMap, setEdges, updateService]
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      if (!data) return;

      deletedEdges.forEach((edge) => {
        const projectId = serviceProjectMap.get(edge.target);
        if (!projectId) return;

        void updateService(projectId, edge.target, (node) => ({
          ...node,
          dependsOn: node.dependsOn.filter((id) => id !== edge.source),
        }));
      });
    },
    [data, serviceProjectMap, updateService]
  );

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (!data) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-zinc-950 gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">Visualizing ecosystem...</p>
      </div>
    );
  }

  if (!data || nodes.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-zinc-950 text-center p-8 space-y-4">
        <div className="p-4 bg-zinc-900 rounded-full">
          <Share2 className="w-12 h-12 text-zinc-700" />
        </div>
        <div className="max-w-xs">
          <h3 className="text-xl font-bold text-white mb-2">Empty Ecosystem</h3>
          <p className="text-sm text-muted-foreground">Add services in the Projects tab to see how they connect here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-50 dark:bg-zinc-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        onNodeDragStop={onNodeDragStop}
        fitView
        fitViewOptions={{ maxZoom: 0.8 }}
      >
        <Background />
        <Controls />
        
        <Panel position="top-right" className="flex flex-col gap-2">
          <div className="flex flex-col p-2 gap-2 bg-card/80 backdrop-blur-md border rounded-2xl shadow-2xl">
            {data.projects.length > 0 && (
              <Select
                value={resolvedActiveProjectId ?? ""}
                onChange={(e) => setActiveProjectId(e.target.value)}
                containerClassName="w-[120px]"
                className="h-8 rounded-xl bg-background/80 border-border/60"
              >
                {data.projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </Select>
            )}

            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => fitView({ duration: 400 })} 
              title="Fit View"
              className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
            >
              <Maximize className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleResetLayout} 
              title="Reset Layout"
              className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <div className="w-full h-px bg-border/50 my-1" />

            <AddServiceDialog 
              onAdd={handleAddService}
              trigger={
                <button 
                  title="Add Service"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "rounded-xl hover:bg-primary/10 hover:text-primary transition-all",
                    !resolvedActiveProjectId && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={!resolvedActiveProjectId}
                >
                  <Plus className="w-4 h-4" />
                </button>
              }
            />

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push("/projects")}
              title="Back to Dashboard"
              className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Button>
          </div>
        </Panel>

        <Panel position="bottom-center" className="mb-4">
          <div className="px-4 py-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-primary/5">
            <MousePointer2 className="w-3 h-3" />
            Interactive Workspace
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
