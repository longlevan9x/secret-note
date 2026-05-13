"use client";

import React from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';

export const ProjectNode = ({ data, selected }: NodeProps) => {
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
      <div className="h-full w-full rounded-[2rem] border-2 border-dashed border-primary/20 bg-primary/[0.02] backdrop-blur-[2px] p-6 transition-all duration-500 hover:bg-primary/[0.04] hover:border-primary/40 group/projectnode">
        <div className="absolute -top-4 left-6 bg-primary text-[10px] font-black text-primary-foreground uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-primary/20 border border-white/10">
          {data.label as string}
        </div>
        
        {/* Display description in graph node if available */}
        {!!data.description && (
          <div className="absolute top-6 left-6 pr-6">
            <p className="text-[10px] text-muted-foreground italic line-clamp-2 leading-relaxed">{(data.description as string)}</p>
          </div>
        )}
        
        {/* Subtle decorative background element */}
        <div className="absolute bottom-4 right-6 opacity-5 select-none pointer-events-none">
           <span className="text-4xl font-black italic tracking-tighter uppercase">{data.label as string}</span>
        </div>
      </div>
    </>
  );
};
