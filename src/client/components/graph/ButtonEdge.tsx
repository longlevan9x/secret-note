"use client";

import React, { useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import { ConfirmDialog } from '@/client/components/ui/ConfirmDialog';
import { X } from 'lucide-react';

export default function ButtonEdge({
  id,
  source,
  sourceX,
  sourceY,
  target,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (typeof data?.onDeleteEdge === "function") {
      data.onDeleteEdge(id, source, target);
    }
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
            pointerEvents: 'all',
            zIndex: 1000,
          }}
          className="nodrag nopan"
        >
          <button 
            onClick={onEdgeClick}
            className="w-5 h-5 bg-zinc-900 border border-zinc-700 text-zinc-400 rounded-full flex items-center justify-center hover:bg-destructive hover:text-white hover:border-destructive transition-all duration-200 shadow-lg cursor-pointer group"
            title="Remove dependency"
          >
            <X className="w-3 h-3 group-hover:scale-110" />
          </button>
        </div>
      </EdgeLabelRenderer>

      <ConfirmDialog 
        isOpen={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleConfirmDelete}
        title="Remove Connection"
        description="Are you sure you want to remove this dependency connection between these services?"
      />
    </>
  );
}
