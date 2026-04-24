"use client";

import { useCallback, useMemo, useEffect } from "react";
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkspace } from "@/context/WorkspaceContext";
import { ServiceGraphNode } from "./ServiceGraphNode";
import { ProjectGroupNode } from "./ProjectGroupNode";
import ButtonEdge from "./ButtonEdge";
import { GRAPH_CONFIG, NODE_TYPES } from "@/core/constants/graph";

const nodeTypes = {
  [NODE_TYPES.SERVICE_NODE]: ServiceGraphNode,
  [NODE_TYPES.PROJECT_GROUP]: ProjectGroupNode,
};

const edgeTypes = {
  buttonEdge: ButtonEdge,
};

export function DependencyGraph() {
  const { data, updateWorkspaceData } = useWorkspace();

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (!data) return { initialNodes: nodes, initialEdges: edges };

    let currentY = 0;
    const PADDING = 40;
    
    // Create a map for quick lookup
    const allServiceIds = new Set(data.projects.flatMap(p => p.nodes.map(n => n.id)));

    data.projects.forEach((project) => {
      const serviceCount = project.nodes.length;
      if (serviceCount === 0) return;

      const groupWidth = project.size?.width || (serviceCount * GRAPH_CONFIG.X_OFFSET + PADDING * 2);
      const groupHeight = project.size?.height || (GRAPH_CONFIG.NODE_HEIGHT + PADDING * 2);
      const groupId = `group-${project.id}`;

      // Project Group Node
      nodes.push({
        id: groupId,
        type: NODE_TYPES.PROJECT_GROUP,
        position: project.position || { x: 0, y: currentY },
        style: { width: groupWidth, height: groupHeight },
        data: { 
          label: project.name,
          onResizeEnd: (width: number, height: number) => {
            const updatedProjects = data.projects.map((p) => {
              if (p.id === project.id) {
                return { ...p, size: { width, height } };
              }
              return p;
            });
            updateWorkspaceData({ ...data, projects: updatedProjects });
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
            project: project.name
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
              type: 'buttonEdge',
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
  }, [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeDragStop = useCallback(
    (_: any, node: Node) => {
      if (!data) return;

      const updatedProjects = data.projects.map((project) => {
        // If it's a project group
        if (`group-${project.id}` === node.id) {
          return { ...project, position: node.position };
        }
        
        // If it's a service node
        return {
          ...project,
          nodes: project.nodes.map((n) => 
            n.id === node.id ? { ...n, position: node.position } : n
          ),
        };
      });

      updateWorkspaceData({ ...data, projects: updatedProjects });
    },
    [data, updateWorkspaceData]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (!data || !params.source || !params.target) return;

      const sourceId = params.source;
      const targetId = params.target;

      const updatedProjects = data.projects.map((project) => ({
        ...project,
        nodes: project.nodes.map((node) => {
          if (node.id === targetId) {
            if (!node.dependsOn.includes(sourceId)) {
              return { ...node, dependsOn: [...node.dependsOn, sourceId] };
            }
          }
          return node;
        }),
      }));

      updateWorkspaceData({ ...data, projects: updatedProjects });
      setEdges((eds) => addEdge({ ...params, type: 'buttonEdge' }, eds));
    },
    [data, updateWorkspaceData, setEdges]
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      if (!data) return;

      const updatedProjects = data.projects.map((project) => ({
        ...project,
        nodes: project.nodes.map((node) => {
          const relevantEdges = deletedEdges.filter((e) => e.target === node.id);
          if (relevantEdges.length > 0) {
            const sourceIdsToRemove = relevantEdges.map((e) => e.source);
            return {
              ...node,
              dependsOn: node.dependsOn.filter((id) => !sourceIdsToRemove.includes(id)),
            };
          }
          return node;
        }),
      }));

      updateWorkspaceData({ ...data, projects: updatedProjects });
    },
    [data, updateWorkspaceData]
  );

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (!data || nodes.length === 0) {
    return <div className="flex h-full items-center justify-center">No services available to map.</div>;
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
        fitViewOptions={{ maxZoom: 1 }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
