"use client";

import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import Image from "next/image";
import { GRAPH_CONFIG } from "@/core/constants/graph";

interface ServiceGraphNodeProps {
  data: {
    label: string;
    icon?: string;
    provider: string;
    env: string;
    project: string;
  };
}

export const ServiceGraphNode = ({ data }: ServiceGraphNodeProps) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-card border-2 border-primary/20 min-w-[150px] hover:border-primary cursor-pointer transition-all duration-300 hover:shadow-lg active:scale-95">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-primary" 
      />
      <div className="flex items-center gap-3">
        {data.icon && !imgError ? (
          <Image 
            src={`https://cdn.simpleicons.org/${data.icon}`} 
            alt="" 
            width={GRAPH_CONFIG.ICON_SIZE}
            height={GRAPH_CONFIG.ICON_SIZE}
            className="w-6 h-6"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-[10px] font-bold uppercase">
            {data.provider[0]}
          </div>
        )}
        <div className="flex flex-col">
          <div className="text-xs font-bold truncate max-w-[100px]">{data.label}</div>
          <div className="text-[10px] text-muted-foreground">{data.env}</div>
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-primary" 
      />
    </div>
  );
};
