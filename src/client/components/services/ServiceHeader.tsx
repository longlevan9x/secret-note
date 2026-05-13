"use client";

import Image from "next/image";
import { useState } from "react";
import { Button, Input } from "@/client/components/ui";
import { Trash2, Pencil, Check } from "lucide-react";
import { ServiceNode } from "@/shared/schema/types";

interface ServiceHeaderProps {
  service: ServiceNode;
  isEditingMetadata: boolean;
  editName: string;
  setEditName: (name: string) => void;
  setIsEditingMetadata: (isEditing: boolean) => void;
  handleUpdateMetadata: () => void;
  setConfirmDelete: (state: { type: "service" | "secret" } | null) => void;
}

export function ServiceHeader({
  service,
  isEditingMetadata,
  editName,
  setEditName,
  setIsEditingMetadata,
  handleUpdateMetadata,
  setConfirmDelete,
}: ServiceHeaderProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700 shadow-xl overflow-hidden relative group">
          {service.icon && !imgError ? (
            <Image 
              src={`https://cdn.simpleicons.org/${service.icon}`}
              alt={service.name}
              width={64}
              height={64}
              className="object-contain p-3"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : !imgError ? (
            <Image 
              src={`https://logo.clearbit.com/${service.name.toLowerCase().replace(/\s+/g, '')}.com`}
              alt={service.name}
              width={64}
              height={64}
              className="object-contain p-2"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="text-2xl font-black text-primary/40 uppercase">
              {service.name.substring(0, 2)}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          {isEditingMetadata ? (
            <div className="flex items-center gap-2">
              <Input 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                className="h-8 w-48 bg-zinc-950"
              />
              <Button size="sm" onClick={handleUpdateMetadata}>
                <Check className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black tracking-tight text-white">{service.name}</h1>
              <Button variant="ghost" size="icon" onClick={() => setIsEditingMetadata(true)} className="h-6 w-6">
                <Pencil className="w-3 h-3" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
              {service.env}
            </span>
            <span className="text-xs text-muted-foreground">
              ID: <code className="text-zinc-500">{service.id}</code>
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => setConfirmDelete({ type: "service" })}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Service
        </Button>
      </div>
    </div>
  );
}
