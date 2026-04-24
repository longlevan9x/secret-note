"use client";

import React from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';

export const ProjectGroupNode = ({ data, selected }: NodeProps) => {
  return (
    <>
      <NodeResizer 
        color="#3b82f6" 
        isVisible={selected} 
        minWidth={200} 
        minHeight={150} 
        onResizeEnd={(_, { width, height }) => {
          if (data.onResizeEnd) {
            (data.onResizeEnd as (w: number, h: number) => void)(width, height);
          }
        }}
      />
      <div className="h-full w-full rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 p-4 transition-colors group-hover:bg-primary/10">
        <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-bold text-primary uppercase tracking-widest border rounded shadow-sm">
          {data.label as string}
        </div>
      </div>
    </>
  );
};
