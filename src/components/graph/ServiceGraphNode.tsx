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
    color?: string;
  };
}

export const ServiceGraphNode = ({ data }: ServiceGraphNodeProps) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative">
      {/* Selection Glow Effect */}
      <div 
        className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"
        style={{ backgroundColor: data.color || "var(--primary)" }}
      ></div>
      
      <div className="relative px-5 py-4 shadow-xl rounded-2xl bg-card/80 backdrop-blur-md border border-white/10 min-w-[180px] transition-all duration-300 hover:-translate-y-1 active:scale-95">
        <Handle 
          type="target" 
          position={Position.Top} 
          className="w-3 h-3 border-2 border-background shadow-sm" 
          style={{ backgroundColor: data.color || "var(--primary)" }}
        />
        
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-background/50 shadow-inner border border-white/5">
            {data.icon && !imgError ? (
              <Image 
                src={`https://cdn.simpleicons.org/${data.icon}`} 
                alt="" 
                width={GRAPH_CONFIG.ICON_SIZE}
                height={GRAPH_CONFIG.ICON_SIZE}
                className="w-7 h-7 object-contain"
                unoptimized
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-black text-primary uppercase">
                {data.provider[0]}
              </div>
            )}
          </div>
          
          <div className="flex flex-col flex-1 min-w-0">
            <div className="text-sm font-bold truncate tracking-tight text-foreground">{data.label}</div>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${data.env.toLowerCase().includes('prod') ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{data.env}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] text-muted-foreground/60 font-mono uppercase">{data.provider}</span>
          <div className="px-1.5 py-0.5 rounded bg-muted/30 text-[8px] text-muted-foreground font-bold border border-white/5 uppercase">
            ID: {data.project.slice(0, 4)}
          </div>
        </div>

        <Handle 
          type="source" 
          position={Position.Bottom} 
          className="w-3 h-3 border-2 border-background shadow-sm" 
          style={{ backgroundColor: data.color || "var(--primary)" }}
        />
      </div>
    </div>
  );
};
