"use client";

import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import { DeleteConfirmDialog } from '../dashboard/DeleteConfirmDialog';

export default function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <DeleteConfirmDialog 
            title="Remove Connection"
            description="Are you sure you want to remove this dependency connection?"
            onConfirm={onEdgeClick}
            trigger={
              <button 
                className="w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-125 active:scale-90 transition-all duration-200 shadow-md cursor-pointer border-none outline-none"
              >
                ×
              </button>
            }
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
