"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServiceNode } from "@/core/schema/types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface ServiceCardProps {
  service: ServiceNode;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function ServiceCard({ service, isSelected, onClick, onDelete }: ServiceCardProps) {
  const [imgError, setImgError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  return (
    <>
      <Card 
        className={`relative group/card cursor-pointer transition-all hover:shadow-md active:scale-[0.98] ${
          isSelected ? 'border-primary ring-1 ring-primary/20' : ''
        }`}
        onClick={onClick}
      >
        <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0">
          {service.icon && !imgError ? (
            <Image 
              src={`https://cdn.simpleicons.org/${service.icon}`} 
              alt={service.name} 
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {service.provider[0].toUpperCase()}
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-0">
            <CardTitle className="text-base truncate">{service.name}</CardTitle>
            <CardDescription className="text-xs truncate">{service.provider} - {service.env}</CardDescription>
          </div>
          
          <div className="opacity-0 group-hover/card:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDeleteClick}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <ConfirmDialog 
        isOpen={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={onDelete}
        title="Delete Service"
        description={`Are you sure you want to delete "${service.name}"? This action cannot be undone.`}
      />
    </>
  );
}
